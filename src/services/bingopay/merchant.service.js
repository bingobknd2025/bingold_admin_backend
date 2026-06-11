// services/bingopay/merchant.service.js
//
// The VENDOR point of view. A merchant is just a BinGold user with a
// vendor_profile. Everything here is authenticated by the vendor's own BinGold
// token (resolved to their identity), so a merchant manages only their own shop.
// No wallet/balance is stored — earnings & withdrawals go through BinGold.
const db = require('../../models');
const { VendorProfile, BingopayUser, PaymentTransaction, PaymentQrCode } = db;
const ApiError = require('../../utils/apiError.util');
const UserSync = require('./user-sync.service');
const VendorService = require('./vendor.service');
const QrService = require('./qr.service');
const WalletService = require('./wallet.service');
const VendorKycService = require('./vendor-kyc.service');

const KNOWN_COINS = ['BIGOD', 'USDT', 'BNB', 'ETH', 'BTC'];

function normalizeCoins(coins) {
    if (!Array.isArray(coins)) return null;
    const up = coins.map((c) => String(c).toUpperCase()).filter((c) => KNOWN_COINS.includes(c));
    return up.length ? Array.from(new Set(up)) : null;
}

class MerchantService {
    // Resolve the caller's local user, and (optionally) their vendor profile.
    async _identity(token) {
        const { user, info } = await UserSync.resolveFromToken(token, { account_type: 'vendor' });
        return { user, info };
    }

    async _myVendor(token, { required = true, mustBeActive = false } = {}) {
        const { user } = await this._identity(token);
        const vendor = await VendorProfile.findOne({ where: { user_id: user.id } });
        if (required && !vendor) throw new ApiError(404, 'You are not registered as a merchant yet');
        if (vendor && mustBeActive && vendor.status !== 'active') {
            throw new ApiError(403, `Merchant is not active (status: ${vendor.status})`);
        }
        return { user, vendor };
    }

    // ─── Onboarding ──────────────────────────────────────────────
    // Apply to become a merchant. Idempotent: returns the existing profile if
    // the caller already applied.
    async apply(token, data = {}) {
        if (!data.business_name) throw new ApiError(400, 'business_name is required');
        const { user } = await this._identity(token);

        const existing = await VendorProfile.findOne({ where: { user_id: user.id } });
        if (existing) return { alreadyMerchant: true, vendor: existing };

        // Reuse the admin onboarding path so merchant_code generation etc. is shared.
        const vendor = await VendorService.createVendor({
            user_id: user.id,
            business_name: data.business_name,
            business_type: data.business_type,
            registration_number: data.registration_number,
            gst_number: data.gst_number,
            pan_number: data.pan_number,
            address: data.address,
            website: data.website,
            annual_turnover: data.annual_turnover
        }, null);

        // Apply coin preferences if supplied at apply-time.
        const accepted = normalizeCoins(data.accepted_coins) || ['BIGOD'];
        await vendor.update({
            settle_coin: (data.settle_coin || 'BIGOD').toUpperCase(),
            accepted_coins: accepted
        });

        return { alreadyMerchant: false, vendor };
    }

    async getMine(token) {
        const { vendor } = await this._myVendor(token, { required: true });
        return vendor;
    }

    async updateSettings(token, data = {}) {
        const { vendor } = await this._myVendor(token, { required: true });
        const patch = {};
        if (data.settle_coin) {
            const sc = String(data.settle_coin).toUpperCase();
            if (!KNOWN_COINS.includes(sc)) throw new ApiError(400, `settle_coin must be one of: ${KNOWN_COINS.join(', ')}`);
            patch.settle_coin = sc;
        }
        if (data.accepted_coins !== undefined) {
            const ac = normalizeCoins(data.accepted_coins);
            if (!ac) throw new ApiError(400, `accepted_coins must be a non-empty subset of: ${KNOWN_COINS.join(', ')}`);
            patch.accepted_coins = ac;
        }
        // Allow editing safe business fields too.
        ['business_name', 'business_type', 'website', 'address'].forEach((f) => {
            if (data[f] !== undefined) patch[f] = data[f];
        });
        return vendor.update(patch);
    }

    // ─── Merchant QR ─────────────────────────────────────────────
    async createQr(token, data = {}) {
        const { vendor } = await this._myVendor(token, { required: true, mustBeActive: true });
        return QrService.createQr({
            vendor_id: vendor.id,
            qr_type: data.qr_type,
            amount: data.amount,
            coin: data.coin || vendor.settle_coin,
            label: data.label
        }, null);
    }

    async listQr(token, filters = {}) {
        const { vendor } = await this._myVendor(token, { required: true });
        return QrService.getList(
            parseInt(filters.page, 10) || 1,
            parseInt(filters.limit, 10) || 10,
            { ...filters, vendor_id: vendor.id }
        );
    }

    async toggleQr(token, id, status) {
        const { vendor } = await this._myVendor(token, { required: true });
        const qr = await PaymentQrCode.findByPk(id);
        if (!qr || qr.vendor_id !== vendor.id) throw new ApiError(404, 'QR not found');
        return qr.update({ status: Boolean(status) });
    }

    // ─── Dashboard / payments ────────────────────────────────────
    async dashboard(token) {
        const { vendor } = await this._myVendor(token, { required: true });
        const where = { receiver_vendor_id: vendor.id };

        const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);

        const [totalCount, successCount, pendingCount, failedCount, byCoin, todaySuccess] = await Promise.all([
            PaymentTransaction.count({ where }),
            PaymentTransaction.count({ where: { ...where, status: 'success' } }),
            PaymentTransaction.count({ where: { ...where, status: ['initiated', 'processing'] } }),
            PaymentTransaction.count({ where: { ...where, status: 'failed' } }),
            PaymentTransaction.findAll({
                where: { ...where, status: 'success' },
                attributes: ['coin', [db.Sequelize.fn('SUM', db.Sequelize.col('amount')), 'total']],
                group: ['coin'],
                raw: true
            }),
            PaymentTransaction.findAll({
                where: { ...where, status: 'success', created_at: { [db.Sequelize.Op.gte]: startOfToday } },
                attributes: ['coin', [db.Sequelize.fn('SUM', db.Sequelize.col('amount')), 'total']],
                group: ['coin'],
                raw: true
            })
        ]);

        return {
            merchant: { id: vendor.id, name: vendor.business_name, merchant_code: vendor.merchant_code, status: vendor.status, settle_coin: vendor.settle_coin },
            counts: { total: totalCount, success: successCount, pending: pendingCount, failed: failedCount },
            earningsByCoin: byCoin,      // [{ coin, total }]
            todayByCoin: todaySuccess
        };
    }

    async payments(token, filters = {}) {
        const { vendor } = await this._myVendor(token, { required: true });
        const page = parseInt(filters.page, 10) || 1;
        const limit = parseInt(filters.limit, 10) || 10;
        const offset = (page - 1) * limit;
        const where = { receiver_vendor_id: vendor.id };
        if (filters.status) where.status = filters.status;
        if (filters.coin) where.coin = filters.coin;

        const { count, rows } = await PaymentTransaction.findAndCountAll({
            where,
            include: [{ model: BingopayUser, as: 'sender', attributes: ['id', 'email', 'phone'] }],
            limit, offset, order: [['created_at', 'DESC']]
        });
        return { total: count, page, totalPages: Math.ceil(count / limit), data: rows };
    }

    // ─── Offline KYC (vendor self-submits documents) ─────────────
    async submitKyc(token, files) {
        const { vendor } = await this._myVendor(token, { required: true });
        // Vendor self-upload — no admin id.
        return VendorKycService.submitDocuments(vendor.id, files, {});
    }

    async kycDocuments(token) {
        const { vendor } = await this._myVendor(token, { required: true });
        return VendorKycService.getDocuments(vendor.id);
    }

    // ─── Earnings withdrawal (reuses BinGold withdraw_request) ───
    async withdraw(token, payload = {}) {
        await this._myVendor(token, { required: true, mustBeActive: true });
        return WalletService.withdraw(token, payload);
    }
}

module.exports = new MerchantService();
