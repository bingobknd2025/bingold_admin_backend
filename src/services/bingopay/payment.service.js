// services/bingopay/payment.service.js
//
// Admin read/oversight of payment transactions. The transactions themselves are
// created and settled by BinGold (the system of record); this service only
// reports on the orchestration rows stored locally.
const db = require('../../models');
const { PaymentTransaction, VendorProfile, BingopayUser, PaymentQrCode } = db;
const ApiError = require('../../utils/apiError.util');

class PaymentService {
    async getById(id) {
        const txn = await PaymentTransaction.findByPk(id, {
            include: [
                { model: VendorProfile, as: 'vendor', attributes: ['id', 'business_name', 'merchant_code'] },
                { model: BingopayUser, as: 'sender', attributes: ['id', 'email', 'phone'] },
                { model: PaymentQrCode, as: 'qr', attributes: ['id', 'qr_uuid', 'qr_type'] }
            ]
        });
        if (!txn) throw new ApiError(404, 'Payment transaction not found');
        return txn;
    }

    async getList(page = 1, limit = 10, filters = {}) {
        const offset = (page - 1) * limit;
        const where = {};

        if (filters.status) where.status = filters.status;
        if (filters.coin) where.coin = filters.coin;
        if (filters.receiver_vendor_id) where.receiver_vendor_id = filters.receiver_vendor_id;
        if (filters.sender_user_id) where.sender_user_id = filters.sender_user_id;
        if (filters.search) {
            where[db.Sequelize.Op.or] = [
                { payment_uuid: { [db.Sequelize.Op.like]: `%${filters.search}%` } },
                { bingold_transaction_id: { [db.Sequelize.Op.like]: `%${filters.search}%` } },
                { blockchain_tx_hash: { [db.Sequelize.Op.like]: `%${filters.search}%` } }
            ];
        }
        if (filters.from || filters.to) {
            where.created_at = {};
            if (filters.from) where.created_at[db.Sequelize.Op.gte] = new Date(filters.from);
            if (filters.to) where.created_at[db.Sequelize.Op.lte] = new Date(filters.to);
        }

        const { count, rows } = await PaymentTransaction.findAndCountAll({
            where,
            include: [
                { model: VendorProfile, as: 'vendor', attributes: ['id', 'business_name', 'merchant_code'] }
            ],
            limit,
            offset,
            order: [['created_at', 'DESC']]
        });

        return { total: count, page, totalPages: Math.ceil(count / limit), data: rows };
    }

    // Lightweight stats for the BingoPay dashboard widget.
    async getStats(filters = {}) {
        const where = {};
        if (filters.receiver_vendor_id) where.receiver_vendor_id = filters.receiver_vendor_id;

        const [total, success, failed, pending, successAggregate] = await Promise.all([
            PaymentTransaction.count({ where }),
            PaymentTransaction.count({ where: { ...where, status: 'success' } }),
            PaymentTransaction.count({ where: { ...where, status: 'failed' } }),
            PaymentTransaction.count({ where: { ...where, status: ['initiated', 'processing'] } }),
            PaymentTransaction.sum('amount', { where: { ...where, status: 'success' } })
        ]);

        return {
            totalTransactions: total,
            successCount: success,
            failedCount: failed,
            pendingCount: pending,
            totalSuccessAmount: successAggregate || 0
        };
    }
}

module.exports = new PaymentService();
