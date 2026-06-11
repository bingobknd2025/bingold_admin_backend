// services/bingopay/pay.service.js
//
// The CUSTOMER payment flow against a merchant QR:
//   resolve QR -> quote (with cross-coin conversion) -> confirm (transfer).
//
// The money movement is a BinGold wallet->wallet transfer, which BinGold does
// not expose yet. We orchestrate everything around it and call a pluggable
// transfer adapter (BingoldApi.walletTransfer). Until that endpoint exists,
// confirm records the payment as 'processing' and reports transferPending=true.
const { v4: uuidv4 } = require('uuid');
const db = require('../../models');
const { PaymentQrCode, VendorProfile, PaymentTransaction } = db;
const ApiError = require('../../utils/apiError.util');
const BingoldApi = require('./bingold-api.service');
const UserSync = require('./user-sync.service');
const Audit = require('./audit.service');

function vendorAcceptedCoins(vendor) {
    const coins = Array.isArray(vendor.accepted_coins) && vendor.accepted_coins.length
        ? vendor.accepted_coins
        : [vendor.settle_coin || 'BIGOD'];
    return coins.map((c) => String(c).toUpperCase());
}

// The BinGold token symbol(s) — the merchant settlement asset.
const BIGOD_SYMBOLS = ['BIGOD', 'BIGO', 'BGD'];
// Which field carries the BIGOD price in the conversion payload, and an optional
// divisor (in case the price is quoted in a sub-unit). Configurable because the
// exact BIGOD pricing semantics are a product decision.
const BIGOD_PRICE_FIELD = process.env.BINGOLD_BIGOD_PRICE_FIELD || 'tokenPrice';
const BIGOD_PRICE_DIVISOR = Number(process.env.BINGOLD_BIGOD_PRICE_DIVISOR || 1);

// Build a map of coin -> USD price from the conversion response. The live shape is
//   data: [ { coin:'usdt', coin_price:0.999, baseCurrency:'USD', tokenPrice, marketPrice }, ... ]
// where coin_price is the USD price of each listed coin and tokenPrice/marketPrice
// carry the BIGOD price (same across rows).
function usdPriceMap(resp) {
    const d = (resp && (resp.data ?? resp));
    const map = {};
    if (Array.isArray(d)) {
        for (const row of d) {
            if (row && row.coin && row.coin_price != null) {
                map[String(row.coin).toUpperCase()] = Number(row.coin_price);
            }
        }
        const first = d[0] || {};
        const bigodPrice = Number(first[BIGOD_PRICE_FIELD]);
        if (!Number.isNaN(bigodPrice) && bigodPrice > 0) {
            const p = bigodPrice / (BIGOD_PRICE_DIVISOR || 1);
            BIGOD_SYMBOLS.forEach((s) => { map[s] = p; });
        }
    }
    // USD/USDT anchor.
    if (map.USD == null) map.USD = 1;
    return map;
}

// Cross rate = how many settleCoin equal 1 payCoin (both priced in USD).
// Returns { rate, payAmount } or null if either price is unknown.
function crossRate(resp, payCoin, settleCoin, settleAmount) {
    const map = usdPriceMap(resp);
    const payUsd = map[payCoin];
    const settleUsd = map[settleCoin];
    if (!payUsd || !settleUsd || payUsd <= 0 || settleUsd <= 0) return null;
    const rate = payUsd / settleUsd;            // settleCoin per 1 payCoin
    const payAmount = settleAmount / rate;      // payCoin needed for settleAmount
    return { rate, payAmount, payUsd, settleUsd };
}

class PayService {
    async _resolveQr(qrUuid) {
        if (!qrUuid) throw new ApiError(400, 'qr identifier is required');
        const qr = await PaymentQrCode.findOne({
            where: { qr_uuid: qrUuid },
            include: [{ model: VendorProfile, as: 'vendor' }]
        });
        if (!qr) throw new ApiError(404, 'QR not found');
        if (!qr.status) throw new ApiError(400, 'This QR is inactive');
        if (!qr.vendor) throw new ApiError(404, 'Merchant not found for this QR');
        if (qr.vendor.status !== 'active') throw new ApiError(400, 'Merchant is not active');
        return qr;
    }

    // What the payer app shows after scanning: who they're paying + accepted coins.
    async resolveQr(qrUuid) {
        const qr = await this._resolveQr(qrUuid);
        const v = qr.vendor;
        return {
            qr: { uuid: qr.qr_uuid, type: qr.qr_type, fixedAmount: qr.amount, coin: qr.coin },
            merchant: {
                id: v.id,
                name: v.business_name,
                merchant_code: v.merchant_code,
                settle_coin: v.settle_coin || 'BIGOD',
                accepted_coins: vendorAcceptedCoins(v)
            }
        };
    }

    // Compute how much `payCoin` the customer needs. settleAmount is in the
    // merchant's settle_coin (from the QR for a fixed/dynamic amount, else from input).
    async quote({ qrUuid, payCoin, amount }) {
        const qr = await this._resolveQr(qrUuid);
        const v = qr.vendor;
        const settleCoin = (v.settle_coin || qr.coin || 'BIGOD').toUpperCase();
        payCoin = (payCoin || settleCoin).toUpperCase();

        const settleAmount = qr.amount != null ? Number(qr.amount) : Number(amount);
        if (!settleAmount || settleAmount <= 0) throw new ApiError(400, 'amount is required for an open-amount QR');

        // Direct payment (merchant accepts the pay coin and it equals settle coin).
        if (payCoin === settleCoin) {
            return { settleCoin, settleAmount, payCoin, payAmount: settleAmount, rate: 1, converted: false };
        }

        // Cross-coin: price both legs in USD via the BinGold conversion feed.
        const rateResp = await BingoldApi.buyTokenPriceConversion({ from: payCoin, to: settleCoin, amount: settleAmount });
        const cr = crossRate(rateResp, payCoin, settleCoin, settleAmount);
        if (!cr) {
            throw new ApiError(502, `Could not price ${payCoin}->${settleCoin} from BinGold (unknown coin price)`);
        }
        return {
            settleCoin, settleAmount, payCoin,
            payAmount: cr.payAmount, rate: cr.rate, converted: true,
            priceUsd: { [payCoin]: cr.payUsd, [settleCoin]: cr.settleUsd }
        };
    }

    // Execute the payment. Requires the customer's BinGold token. PIN/OTP, when
    // provided, are forwarded to the transfer adapter (BinGold enforces them).
    async confirm(token, { qrUuid, payCoin, amount, pin, otp, note }) {
        const qr = await this._resolveQr(qrUuid);
        const v = qr.vendor;

        // Identify the payer and ensure a local mapping row.
        const { user: payer } = await UserSync.resolveFromToken(token, { account_type: 'customer' });

        const q = await this.quote({ qrUuid, payCoin, amount });
        const acceptsDirect = vendorAcceptedCoins(v).includes(q.payCoin);

        // Record the payment up-front as 'initiated' (our merchant_payment_log).
        const txn = await PaymentTransaction.create({
            payment_uuid: uuidv4(),
            qr_id: qr.id,
            sender_user_id: payer.id,
            sender_bingold_user_id: payer.bingold_user_id || null,
            receiver_vendor_id: v.id,
            amount: q.settleAmount,
            coin: q.settleCoin,
            pay_coin: q.payCoin,
            pay_amount: q.payAmount,
            conversion_rate: q.converted ? q.rate : 1,
            status: 'initiated',
            note: note || null
        });

        // Build the transfer request. If the merchant accepts the pay coin
        // directly we transfer pay_coin; otherwise we transfer the settle coin
        // (conversion is assumed to happen on the BinGold side / pre-step).
        const transferCoin = acceptsDirect ? q.payCoin : q.settleCoin;
        const transferAmount = acceptsDirect ? q.payAmount : q.settleAmount;
        const transferReq = {
            toBingoldUserId: v.user_id ? undefined : undefined, // resolved below
            merchantCode: v.merchant_code,
            merchantVendorId: v.id,
            coin: transferCoin,
            amount: transferAmount,
            ...(pin ? { pin } : {}),
            ...(otp ? { otp } : {}),
            paymentUuid: txn.payment_uuid
        };

        // The merchant's receiving identity in BinGold.
        const merchantUser = await db.BingopayUser.findByPk(v.user_id, { attributes: ['bingold_user_id'] });
        if (merchantUser && merchantUser.bingold_user_id != null) {
            transferReq.toBingoldUserId = merchantUser.bingold_user_id;
        }

        if (!BingoldApi.isTransferEnabled()) {
            // No transfer API yet — leave as a pending orchestration record.
            await txn.update({ status: 'processing', failure_reason: 'Awaiting BinGold wallet-transfer API' });
            await Audit.log({
                request_type: 'payment_transfer', request_payload: transferReq,
                response_payload: { pending: true, reason: 'BINGOLD_TRANSFER_PATH not configured' },
                sync_status: 'success', bingopay_user_id: payer.id, bingold_user_id: payer.bingold_user_id
            });
            return { transaction: txn, transferPending: true, quote: q };
        }

        try {
            const res = await BingoldApi.walletTransfer(token, transferReq);
            const d = (res && (res.data ?? res)) || {};
            await txn.update({
                status: 'success',
                bingold_transaction_id: d.transactionId || d.txnId || d.id || null,
                blockchain_tx_hash: d.txHash || d.hash || null
            });
            await Audit.log({
                request_type: 'payment_transfer', request_payload: transferReq, response_payload: res,
                sync_status: 'success', bingopay_user_id: payer.id, bingold_user_id: payer.bingold_user_id
            });
            return { transaction: txn, transferPending: false, quote: q };
        } catch (err) {
            await txn.update({ status: 'failed', failure_reason: err.message });
            await Audit.log({
                request_type: 'payment_transfer', request_payload: transferReq,
                response_payload: { error: err.message }, sync_status: 'failed',
                bingopay_user_id: payer.id, bingold_user_id: payer.bingold_user_id
            });
            throw err;
        }
    }
}

module.exports = new PayService();
