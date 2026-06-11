// controllers/bingopay/payment.controller.js
const PaymentService = require('../../services/bingopay/payment.service');
const ApiError = require('../../utils/apiError.util');

class PaymentController {
    async list(req, res, next) {
        try {
            const { page, limit, ...filters } = req.body;
            const result = await PaymentService.getList(parseInt(page, 10) || 1, parseInt(limit, 10) || 10, filters);
            res.json({ success: true, message: 'Payment transactions retrieved successfully', data: result });
        } catch (error) { next(error); }
    }

    async view(req, res, next) {
        try {
            const { id } = req.body;
            if (!id) throw new ApiError(400, 'Transaction id is required');
            const txn = await PaymentService.getById(id);
            res.json({ success: true, message: 'Payment transaction fetched successfully', data: txn });
        } catch (error) { next(error); }
    }

    async stats(req, res, next) {
        try {
            const result = await PaymentService.getStats(req.body || {});
            res.json({ success: true, message: 'Payment stats retrieved successfully', data: result });
        } catch (error) { next(error); }
    }
}

module.exports = new PaymentController();
