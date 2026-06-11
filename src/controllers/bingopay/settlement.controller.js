// controllers/bingopay/settlement.controller.js
const SettlementService = require('../../services/bingopay/settlement.service');
const ApiError = require('../../utils/apiError.util');

class SettlementController {
    async create(req, res, next) {
        try {
            if (!req.user || !req.user.pda_user_id) throw new ApiError(401, 'Unauthorized');
            const settlement = await SettlementService.create(req.body, req.user.pda_user_id);
            res.status(201).json({ success: true, message: 'Settlement created successfully', data: settlement });
        } catch (error) { next(error); }
    }

    async list(req, res, next) {
        try {
            const { page, limit, ...filters } = req.body;
            const result = await SettlementService.getList(parseInt(page, 10) || 1, parseInt(limit, 10) || 10, filters);
            res.json({ success: true, message: 'Settlements retrieved successfully', data: result });
        } catch (error) { next(error); }
    }

    async view(req, res, next) {
        try {
            const { id } = req.body;
            if (!id) throw new ApiError(400, 'Settlement id is required');
            const settlement = await SettlementService.getById(id);
            res.json({ success: true, message: 'Settlement fetched successfully', data: settlement });
        } catch (error) { next(error); }
    }

    async updateStatus(req, res, next) {
        try {
            if (!req.user || !req.user.pda_user_id) throw new ApiError(401, 'Unauthorized');
            const { id, status, ...rest } = req.body;
            if (!id) throw new ApiError(400, 'Settlement id is required');
            if (!status) throw new ApiError(400, 'status is required');
            const settlement = await SettlementService.updateStatus(id, status, rest, req.user.pda_user_id);
            res.json({ success: true, message: 'Settlement status updated', data: settlement });
        } catch (error) { next(error); }
    }
}

module.exports = new SettlementController();
