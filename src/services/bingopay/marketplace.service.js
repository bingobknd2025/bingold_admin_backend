// services/bingopay/marketplace.service.js
//
// Server-to-server money movement for the NestJS marketplace. Products/orders
// live in the marketplace; this just moves the BIGOD balance in BinGold when an
// order is paid (debit customer → credit vendor) or refunded (the reverse),
// using the external marketplace_balance_operation API, and records a
// payment_transactions row for audit/idempotency.
const crypto = require('crypto');
const db = require('../../models');
const { BingopayUser, VendorProfile, PaymentTransaction, SsoSyncLog } = db;
const ApiError = require('../../utils/apiError.util');
const BingoldApi = require('./bingold-api.service');
const UserSync = require('./user-sync.service');

const COIN = 'BIGOD';

async function logSso(requestType, status, { userId, payload, response } = {}) {
    try {
        await SsoSyncLog.create({
            bingopay_user_id: userId || null,
            request_type: requestType,
            request_payload: payload || null,
            response_payload: response || null,
            sync_status: status
        });
    } catch (_) { /* never block on logging */ }
}

class MarketplaceService {
    // Resolve the vendor's owner email + local profile from uuid or email.
    async _resolveVendor({ vendorUuid, vendorEmail }) {
        let vendor = null;
        if (vendorUuid) {
            vendor = await VendorProfile.findOne({
                where: { uuid: vendorUuid },
                include: [{ model: BingopayUser, as: 'user', attributes: ['id', 'email'] }]
            });
            if (!vendor) throw new ApiError(404, 'Vendor not found');
        } else if (vendorEmail) {
            const u = await BingopayUser.findOne({ where: { email: vendorEmail } });
            if (u) vendor = await VendorProfile.findOne({ where: { user_id: u.id }, include: [{ model: BingopayUser, as: 'user', attributes: ['id', 'email'] }] });
        }
        const email = vendorEmail || (vendor && vendor.user ? vendor.user.email : null);
        if (!email) throw new ApiError(400, 'vendorUuid or vendorEmail is required');
        return { vendor, email };
    }

    async _bigoldBalance(email) {
        try { return (await UserSync.syncFromExternalProfile(email)).bigoldBalance; } catch (_) { return undefined; }
    }

    // Pay for an order: deduct the customer's BIGOD, credit the vendor (amount
    // minus optional commission). Idempotent on `reference` (the order id).
    async orderPay({ customerEmail, vendorUuid, vendorEmail, amount, commission, reference, description } = {}) {
        if (!customerEmail) throw new ApiError(400, 'customerEmail is required');
        const amt = Number(amount);
        if (!Number.isFinite(amt) || amt <= 0) throw new ApiError(400, 'amount must be a positive number');
        const fee = Number(commission) || 0;
        if (fee < 0 || fee > amt) throw new ApiError(400, 'commission must be between 0 and amount');
        const vendorAmount = amt - fee;

        const { vendor, email: vEmail } = await this._resolveVendor({ vendorUuid, vendorEmail });
        const customer = await BingopayUser.findOne({ where: { email: customerEmail } });

        // Idempotency: a prior successful txn for this order id is returned as-is.
        if (reference) {
            const prior = await PaymentTransaction.findOne({ where: { payment_uuid: reference } });
            if (prior && prior.status === 'success') {
                return { transaction: prior, idempotent: true };
            }
        }

        const txn = await PaymentTransaction.create({
            payment_uuid: reference || crypto.randomUUID(),
            sender_user_id: customer ? customer.id : null,
            receiver_vendor_id: vendor ? vendor.id : null,
            amount: amt,
            coin: COIN,
            pay_coin: COIN,
            pay_amount: amt,
            conversion_rate: 1,
            status: 'initiated',
            note: description || null
        });

        // 1) Debit the customer.
        let debit;
        try {
            debit = await BingoldApi.marketplaceBalanceOperation({
                email: customerEmail, amount: amt, operation: 'deduct',
                reference, description: description || 'Marketplace order debit'
            });
        } catch (err) {
            await txn.update({ status: 'failed', failure_reason: `debit failed: ${err.message}` });
            await logSso('order_pay', 'failed', { userId: customer && customer.id, payload: { customerEmail, vEmail, amt, reference }, response: { error: err.message } });
            throw err;
        }

        // 2) Credit the vendor — on failure, refund the customer so we don't lose funds.
        try {
            await BingoldApi.marketplaceBalanceOperation({
                email: vEmail, amount: vendorAmount, operation: 'add',
                reference, description: description || 'Marketplace order settlement'
            });
        } catch (err) {
            let refunded = false;
            try {
                await BingoldApi.marketplaceBalanceOperation({
                    email: customerEmail, amount: amt, operation: 'add',
                    reference: `${reference || txn.payment_uuid}-REFUND`, description: 'Auto-refund: vendor credit failed'
                });
                refunded = true;
            } catch (_) { /* refund also failed — flag for manual reconciliation */ }
            await txn.update({ status: 'failed', failure_reason: `vendor credit failed: ${err.message}; refunded=${refunded}` });
            await logSso('order_pay', 'failed', { userId: customer && customer.id, payload: { customerEmail, vEmail, amt, reference }, response: { error: err.message, refunded } });
            throw new ApiError(502, `Vendor credit failed${refunded ? ' (customer auto-refunded)' : ' and refund FAILED — needs manual reconciliation'}: ${err.message}`);
        }

        await txn.update({ status: 'success', bingold_transaction_id: (debit && debit.data && (debit.data.id || debit.data.reference)) || null });
        await logSso('order_pay', 'success', { userId: customer && customer.id, payload: { customerEmail, vEmail, amt, fee, reference }, response: { txn: txn.payment_uuid } });

        return {
            transaction: txn,
            idempotent: false,
            amount: amt,
            commission: fee,
            vendorAmount,
            customer: { email: customerEmail, bigoldBalance: await this._bigoldBalance(customerEmail) },
            vendor: { email: vEmail, uuid: vendor ? vendor.uuid : null, bigoldBalance: await this._bigoldBalance(vEmail) }
        };
    }

    // Refund an order: credit the customer, deduct the vendor (the reverse).
    async orderRefund({ customerEmail, vendorUuid, vendorEmail, amount, commission, reference, description } = {}) {
        if (!customerEmail) throw new ApiError(400, 'customerEmail is required');
        const amt = Number(amount);
        if (!Number.isFinite(amt) || amt <= 0) throw new ApiError(400, 'amount must be a positive number');
        const fee = Number(commission) || 0;
        const vendorAmount = amt - fee;

        const { vendor, email: vEmail } = await this._resolveVendor({ vendorUuid, vendorEmail });
        const customer = await BingopayUser.findOne({ where: { email: customerEmail } });

        // Pull back from the vendor first, then return to the customer.
        try {
            await BingoldApi.marketplaceBalanceOperation({
                email: vEmail, amount: vendorAmount, operation: 'deduct',
                reference, description: description || 'Marketplace order refund (vendor clawback)'
            });
        } catch (err) {
            await logSso('order_refund', 'failed', { userId: customer && customer.id, payload: { customerEmail, vEmail, amt, reference }, response: { error: err.message } });
            throw err;
        }
        await BingoldApi.marketplaceBalanceOperation({
            email: customerEmail, amount: amt, operation: 'add',
            reference, description: description || 'Marketplace order refund'
        });

        const txn = await PaymentTransaction.create({
            payment_uuid: `${reference || crypto.randomUUID()}-REFUND`,
            sender_user_id: customer ? customer.id : null,
            receiver_vendor_id: vendor ? vendor.id : null,
            amount: amt, coin: COIN, pay_coin: COIN, pay_amount: amt, conversion_rate: 1,
            status: 'success', note: `refund: ${description || ''}`.trim()
        });
        await logSso('order_refund', 'success', { userId: customer && customer.id, payload: { customerEmail, vEmail, amt, reference }, response: { txn: txn.payment_uuid } });

        return {
            transaction: txn,
            amount: amt,
            customer: { email: customerEmail, bigoldBalance: await this._bigoldBalance(customerEmail) },
            vendor: { email: vEmail, uuid: vendor ? vendor.uuid : null, bigoldBalance: await this._bigoldBalance(vEmail) }
        };
    }
}

module.exports = new MarketplaceService();
