// controllers/bingopay/qr.controller.js
const QrService = require('../../services/bingopay/qr.service');
const ApiError = require('../../utils/apiError.util');

class QrController {
    async create(req, res, next) {
        try {
            if (!req.user || !req.user.pda_user_id) throw new ApiError(401, 'Unauthorized');
            const qr = await QrService.createQr(req.body, req.user.pda_user_id);
            res.status(201).json({ success: true, message: 'Payment QR created successfully', data: qr });
        } catch (error) { next(error); }
    }

    async list(req, res, next) {
        try {
            const { page, limit, ...filters } = req.body;
            const result = await QrService.getList(parseInt(page, 10) || 1, parseInt(limit, 10) || 10, filters);
            res.json({ success: true, message: 'Payment QR codes retrieved successfully', data: result });
        } catch (error) { next(error); }
    }

    async view(req, res, next) {
        try {
            const { id } = req.body;
            if (!id) throw new ApiError(400, 'QR id is required');
            const qr = await QrService.getById(id);
            res.json({ success: true, message: 'Payment QR fetched successfully', data: qr });
        } catch (error) { next(error); }
    }

    async changeStatus(req, res, next) {
        try {
            const { id, status } = req.body;
            if (!id) throw new ApiError(400, 'QR id is required');
            if (status === undefined) throw new ApiError(400, 'status is required');
            const qr = await QrService.toggleStatus(id, status);
            res.json({ success: true, message: 'Payment QR status updated', data: qr });
        } catch (error) { next(error); }
    }
}

module.exports = new QrController();
