// controllers/investor_registration.controller.js
//
// Admin surface for the investor-ui signup capture. JWT + permission gated.
const InvestorRegistrationService = require('../services/investor-registration.service');
const ApiError = require('../utils/apiError.util');

class InvestorRegistrationController {
    async list(req, res, next) {
        try {
            const { page, limit, ...filters } = req.body;
            const result = await InvestorRegistrationService.getList(
                parseInt(page, 10) || 1,
                parseInt(limit, 10) || 10,
                filters
            );
            res.json({ success: true, message: 'Investor registrations retrieved successfully', data: result });
        } catch (error) { next(error); }
    }

    async view(req, res, next) {
        try {
            const { id } = req.body;
            if (!id) throw new ApiError(400, 'Registration id is required');
            const registration = await InvestorRegistrationService.getById(id);
            res.json({ success: true, message: 'Investor registration fetched successfully', data: registration });
        } catch (error) { next(error); }
    }
}

module.exports = new InvestorRegistrationController();
