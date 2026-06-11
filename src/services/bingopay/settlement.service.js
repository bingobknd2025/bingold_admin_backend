// services/bingopay/settlement.service.js
//
// Vendor payout batches. The actual payout is executed by BinGold's existing
// admin-approved withdrawal flow; here we track the batch lifecycle and link to
// it via bingold_withdraw_reference.
const crypto = require('crypto');
const db = require('../../models');
const { MerchantSettlement, VendorProfile, PdaUser } = db;
const ApiError = require('../../utils/apiError.util');

function generateReference() {
    return 'STL-' + Date.now().toString(36).toUpperCase() + '-' + crypto.randomBytes(3).toString('hex').toUpperCase();
}

const STATUS_FLOW = {
    pending: ['processing', 'failed'],
    processing: ['completed', 'failed'],
    completed: [],
    failed: ['pending']
};

class SettlementService {
    async create(data, adminUserId) {
        if (!data.vendor_id) throw new ApiError(400, 'vendor_id is required');
        if (data.total_amount == null || Number(data.total_amount) <= 0) {
            throw new ApiError(400, 'total_amount must be greater than 0');
        }

        const vendor = await VendorProfile.findByPk(data.vendor_id);
        if (!vendor) throw new ApiError(404, 'Vendor not found');
        if (vendor.status !== 'active') throw new ApiError(400, 'Vendor must be active to settle');

        return MerchantSettlement.create({
            vendor_id: vendor.id,
            settlement_reference: generateReference(),
            total_amount: data.total_amount,
            coin: data.coin || 'BIGOD',
            settlement_status: 'pending',
            note: data.note || null,
            processed_by: adminUserId || null
        });
    }

    async getById(id) {
        const settlement = await MerchantSettlement.findByPk(id, {
            include: [
                { model: VendorProfile, as: 'vendor', attributes: ['id', 'business_name', 'merchant_code'] },
                { model: PdaUser, as: 'processor', attributes: ['id', 'name', 'email'] }
            ]
        });
        if (!settlement) throw new ApiError(404, 'Settlement not found');
        return settlement;
    }

    async getList(page = 1, limit = 10, filters = {}) {
        const offset = (page - 1) * limit;
        const where = {};

        if (filters.vendor_id) where.vendor_id = filters.vendor_id;
        if (filters.settlement_status) where.settlement_status = filters.settlement_status;
        if (filters.search) where.settlement_reference = { [db.Sequelize.Op.like]: `%${filters.search}%` };

        const { count, rows } = await MerchantSettlement.findAndCountAll({
            where,
            include: [{ model: VendorProfile, as: 'vendor', attributes: ['id', 'business_name', 'merchant_code'] }],
            limit,
            offset,
            order: [['created_at', 'DESC']]
        });

        return { total: count, page, totalPages: Math.ceil(count / limit), data: rows };
    }

    async updateStatus(id, status, data, adminUserId) {
        const settlement = await this.getById(id);
        const current = settlement.settlement_status;

        if (!STATUS_FLOW[current] || !STATUS_FLOW[current].includes(status)) {
            throw new ApiError(400, `Cannot move settlement from '${current}' to '${status}'`);
        }

        const updates = { settlement_status: status, processed_by: adminUserId || settlement.processed_by };
        if (data && data.bingold_withdraw_reference) updates.bingold_withdraw_reference = data.bingold_withdraw_reference;
        if (data && data.note) updates.note = data.note;
        if (status === 'completed') updates.processed_at = new Date();

        return settlement.update(updates);
    }
}

module.exports = new SettlementService();
