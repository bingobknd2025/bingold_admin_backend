// controllers/bingopay/bingopay_user.controller.js
const BingopayUserService = require('../../services/bingopay/bingopay_user.service');
const ApiError = require('../../utils/apiError.util');

class BingopayUserController {
    async list(req, res, next) {
        try {
            const { page, limit, ...filters } = req.body;
            const result = await BingopayUserService.getList(parseInt(page, 10) || 1, parseInt(limit, 10) || 10, filters);
            res.json({ success: true, message: 'BingoPay users retrieved successfully', data: result });
        } catch (error) { next(error); }
    }

    async view(req, res, next) {
        try {
            const { id } = req.body;
            if (!id) throw new ApiError(400, 'User id is required');
            const user = await BingopayUserService.getById(id);
            res.json({ success: true, message: 'BingoPay user fetched successfully', data: user });
        } catch (error) { next(error); }
    }

    async changeStatus(req, res, next) {
        try {
            const { id, status } = req.body;
            if (!id) throw new ApiError(400, 'User id is required');
            if (!status) throw new ApiError(400, 'status is required');
            const user = await BingopayUserService.setStatus(id, status);
            res.json({ success: true, message: 'BingoPay user status updated', data: user });
        } catch (error) { next(error); }
    }

    // Check an email against BinGold (user_exists) and persist the DB entry.
    async checkAndSync(req, res, next) {
        try {
            const { email, ...extra } = req.body;
            if (!email) throw new ApiError(400, 'email is required');
            const result = await BingopayUserService.checkAndSync(email, extra);
            res.json({ success: true, message: 'User checked against BinGold', data: result });
        } catch (error) { next(error); }
    }
}

module.exports = new BingopayUserController();
