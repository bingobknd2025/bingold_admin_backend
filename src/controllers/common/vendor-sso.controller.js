// controllers/common/vendor-sso.controller.js
//
// Thin HTTP layer over VendorSsoService. All routes are authed by x-api-key
// (the global apiKey middleware); vendors are addressed by their public `uuid`.
const VendorSsoService = require('../../services/bingopay/vendor-sso.service');

class VendorSsoController {
    // 1. POST /:uuid/sso/qr
    async generateQr(req, res, next) {
        try {
            const data = await VendorSsoService.generateQr(req.params.uuid, req.body || {});
            res.status(201).json({ success: true, message: 'SSO QR generated', data });
        } catch (error) { next(error); }
    }

    // 2. POST /sso/verify
    async verify(req, res, next) {
        try {
            const data = await VendorSsoService.verifyToken(req.body || {});
            res.json({ success: true, message: 'Token verified', data });
        } catch (error) { next(error); }
    }

    // 3. GET /sso/status/:token
    async status(req, res, next) {
        try {
            const data = await VendorSsoService.getTokenStatus(req.params.token);
            res.json({ success: true, message: 'Token status', data });
        } catch (error) { next(error); }
    }

    // 4. POST /sso/register
    async register(req, res, next) {
        try {
            const data = await VendorSsoService.register(req.body || {});
            res.status(201).json({ success: true, message: 'Vendor registered', data });
        } catch (error) { next(error); }
    }

    // 4b. POST /sso/verify-otp
    async verifyOtp(req, res, next) {
        try {
            const data = await VendorSsoService.verifyOtp(req.body || {});
            res.status(201).json({ success: true, message: 'Vendor registered', data });
        } catch (error) { next(error); }
    }

    // 4c. POST /sso/resend-otp
    async resendOtp(req, res, next) {
        try {
            const data = await VendorSsoService.resendOtp(req.body || {});
            res.json({ success: true, message: 'OTP resent', data });
        } catch (error) { next(error); }
    }

    // 5. POST /sso/login
    async login(req, res, next) {
        try {
            const data = await VendorSsoService.login(req.body || {});
            res.json({ success: true, message: 'Login successful', data });
        } catch (error) { next(error); }
    }

    // 6. GET /sso/vendor-status/:identifier
    async vendorStatus(req, res, next) {
        try {
            const data = await VendorSsoService.getVendorStatus(req.params.identifier);
            res.json({ success: true, message: 'Vendor status', data });
        } catch (error) { next(error); }
    }

    // 6c. GET /:uuid/sso/profile
    async profile(req, res, next) {
        try {
            const data = await VendorSsoService.getProfile(req.params.uuid);
            res.json({ success: true, message: 'Vendor profile', data });
        } catch (error) { next(error); }
    }

    // 6b. POST /:uuid/sso/receive-qr
    async receiveQr(req, res, next) {
        try {
            const data = await VendorSsoService.receiveQr(req.params.uuid, req.body || {});
            res.json({ success: true, message: 'Receive QR generated', data });
        } catch (error) { next(error); }
    }

    // 7. POST /:uuid/sso/kyc
    async submitKyc(req, res, next) {
        try {
            const data = await VendorSsoService.submitKyc(req.params.uuid, req.body || {});
            res.status(201).json({ success: true, message: 'KYC documents submitted', data });
        } catch (error) { next(error); }
    }

    // 8. GET /:uuid/sso/kyc
    async getKyc(req, res, next) {
        try {
            const data = await VendorSsoService.getKyc(req.params.uuid);
            res.json({ success: true, message: 'KYC status', data });
        } catch (error) { next(error); }
    }

    // 9. PATCH /:uuid/sso/kyc/decision
    async kycDecision(req, res, next) {
        try {
            const data = await VendorSsoService.applyDecision(req.params.uuid, req.body || {});
            res.json({ success: true, message: 'KYC decision applied', data });
        } catch (error) { next(error); }
    }
}

module.exports = new VendorSsoController();
