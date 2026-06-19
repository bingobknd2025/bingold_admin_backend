// controllers/bingopay/customer.controller.js
//
// Customer-facing BingoPay auth/onboarding. Mounted behind the api-key but NOT
// the admin JWT — these are called by the BingoPay client app.
const CustomerService = require('../../services/bingopay/customer.service');
const ApiError = require('../../utils/apiError.util');

class CustomerController {
    async checkUser(req, res, next) {
        try {
            const { email } = req.body;
            if (!email) throw new ApiError(400, 'email is required');
            const result = await CustomerService.checkUser(email);
            res.json({ success: true, message: 'User existence checked', data: result });
        } catch (error) { next(error); }
    }

    async register(req, res, next) {
        try {
            const result = await CustomerService.register(req.body);
            res.status(201).json({ success: true, message: 'Customer registered', data: result });
        } catch (error) { next(error); }
    }

    async login(req, res, next) {
        try {
            const result = await CustomerService.login(req.body);
            res.json({ success: true, message: 'Login processed', data: result });
        } catch (error) { next(error); }
    }

    async profile(req, res, next) {
        try {
            const { email } = req.body;
            if (!email) throw new ApiError(400, 'email is required');
            const result = await CustomerService.getProfile(email);
            res.json({ success: true, message: 'Customer profile', data: result });
        } catch (error) { next(error); }
    }

    async balanceOperation(req, res, next) {
        try {
            const result = await CustomerService.marketplaceBalanceOperation(req.body || {});
            res.json({ success: true, message: 'Balance operation processed', data: result });
        } catch (error) { next(error); }
    }

    async verifyOtp(req, res, next) {
        try {
            const result = await CustomerService.verifyOtp(req.body);
            res.json({ success: true, message: 'OTP verified', data: result });
        } catch (error) { next(error); }
    }

    async resendOtp(req, res, next) {
        try {
            const result = await CustomerService.resendOtp(req.body);
            res.json({ success: true, message: 'OTP resent', data: result });
        } catch (error) { next(error); }
    }
}

module.exports = new CustomerController();
