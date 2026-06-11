// services/bingopay/bingopay_user.service.js
const db = require('../../models');
const { BingopayUser, VendorProfile, SsoSyncLog } = db;
const ApiError = require('../../utils/apiError.util');
const BingoldApi = require('./bingold-api.service');
const UserSync = require('./user-sync.service');

// Read 'exists' out of the BinGold user_exists response. The live shape is
// { status, error, message, data: { exists: bool } }, but we stay defensive.
function parseExists(resp) {
    const d = resp && (resp.data ?? resp);
    if (typeof d === 'boolean') return d;
    return Boolean(d && (d.exists ?? d.userExists ?? d.isExist ?? d.status));
}

class BingopayUserService {
    async getById(id) {
        const user = await BingopayUser.findByPk(id, {
            include: [{ model: VendorProfile, as: 'vendor_profile' }]
        });
        if (!user) throw new ApiError(404, 'BingoPay user not found');
        return user;
    }

    async getList(page = 1, limit = 10, filters = {}) {
        const offset = (page - 1) * limit;
        const where = {};

        if (filters.account_type) where.account_type = filters.account_type;
        if (filters.status) where.status = filters.status;
        if (filters.kyc_status) where.kyc_status = filters.kyc_status;
        if (filters.search) {
            where[db.Sequelize.Op.or] = [
                { email: { [db.Sequelize.Op.like]: `%${filters.search}%` } },
                { phone: { [db.Sequelize.Op.like]: `%${filters.search}%` } },
                { first_name: { [db.Sequelize.Op.like]: `%${filters.search}%` } },
                { last_name: { [db.Sequelize.Op.like]: `%${filters.search}%` } }
            ];
        }

        const { count, rows } = await BingopayUser.findAndCountAll({
            where,
            limit,
            offset,
            order: [['created_at', 'DESC']]
        });

        return { total: count, page, totalPages: Math.ceil(count / limit), data: rows };
    }

    async setStatus(id, status) {
        const ALLOWED = ['pending', 'active', 'blocked', 'suspended'];
        if (!ALLOWED.includes(status)) {
            throw new ApiError(400, `status must be one of: ${ALLOWED.join(', ')}`);
        }
        const user = await this.getById(id);
        return user.update({ status });
    }

    // Check an email against the BinGold identity API (the existing
    // /auth/user_exists endpoint — no new external API) and persist the result
    // as a local bingopay_users entry. Every call is recorded in sso_sync_logs.
    // If the user exists on BinGold we upsert a mapping row so the admin panel
    // has a DB entry to manage; if not, nothing is created.
    async checkAndSync(email, extra = {}) {
        if (!email) throw new ApiError(400, 'email is required');

        let upstream;
        try {
            upstream = await BingoldApi.userExists(email);
        } catch (err) {
            await this._logSso(email, { email }, { error: err.message }, 'failed');
            throw err;
        }

        const exists = parseExists(upstream);
        await this._logSso(email, { email }, upstream, 'success');

        let user = await BingopayUser.findOne({ where: { email } });

        if (exists) {
            // Create or refresh the local mapping entry via the shared helper.
            user = await UserSync.upsertUser({
                email,
                phone: extra.phone,
                first_name: extra.first_name,
                last_name: extra.last_name,
                account_type: extra.account_type || 'customer',
                status: 'active'
            });
        }

        return { exists, hasLocalProfile: Boolean(user), user };
    }

    async _logSso(email, request_payload, response_payload, sync_status) {
        try {
            const existing = await BingopayUser.findOne({ where: { email }, attributes: ['id', 'bingold_user_id'] });
            await SsoSyncLog.create({
                bingopay_user_id: existing ? existing.id : null,
                bingold_user_id: existing ? existing.bingold_user_id : null,
                request_type: 'user_exists',
                request_payload,
                response_payload,
                sync_status
            });
        } catch (_) { /* logging must never break the flow */ }
    }
}

module.exports = new BingopayUserService();
