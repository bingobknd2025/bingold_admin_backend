// controllers/bingopay/merchant.controller.js
//
// Vendor-facing (merchant) endpoints. All require the merchant's BinGold token
// via the bingoldAuth middleware (req.bingoldToken).
const MerchantService = require('../../services/bingopay/merchant.service');
const VendorKycService = require('../../services/bingopay/vendor-kyc.service');
const ApiError = require('../../utils/apiError.util');

class MerchantController {
    async apply(req, res, next) {
        try {
            const result = await MerchantService.apply(req.bingoldToken, req.body);
            res.status(result.alreadyMerchant ? 200 : 201).json({
                success: true,
                message: result.alreadyMerchant ? 'Already registered as merchant' : 'Merchant application submitted',
                data: result.vendor
            });
        } catch (error) { next(error); }
    }

    async me(req, res, next) {
        try {
            const vendor = await MerchantService.getMine(req.bingoldToken);
            res.json({ success: true, message: 'Merchant profile fetched', data: vendor });
        } catch (error) { next(error); }
    }

    async updateSettings(req, res, next) {
        try {
            const vendor = await MerchantService.updateSettings(req.bingoldToken, req.body);
            res.json({ success: true, message: 'Merchant settings updated', data: vendor });
        } catch (error) { next(error); }
    }

    async createQr(req, res, next) {
        try {
            const qr = await MerchantService.createQr(req.bingoldToken, req.body);
            res.status(201).json({ success: true, message: 'QR created', data: qr });
        } catch (error) { next(error); }
    }

    async listQr(req, res, next) {
        try {
            const result = await MerchantService.listQr(req.bingoldToken, req.body || {});
            res.json({ success: true, message: 'QR codes fetched', data: result });
        } catch (error) { next(error); }
    }

    async toggleQr(req, res, next) {
        try {
            const { id, status } = req.body;
            if (!id) throw new ApiError(400, 'id is required');
            const qr = await MerchantService.toggleQr(req.bingoldToken, id, status);
            res.json({ success: true, message: 'QR status updated', data: qr });
        } catch (error) { next(error); }
    }

    async dashboard(req, res, next) {
        try {
            const data = await MerchantService.dashboard(req.bingoldToken);
            res.json({ success: true, message: 'Dashboard fetched', data });
        } catch (error) { next(error); }
    }

    async payments(req, res, next) {
        try {
            const result = await MerchantService.payments(req.bingoldToken, req.body || {});
            res.json({ success: true, message: 'Merchant payments fetched', data: result });
        } catch (error) { next(error); }
    }

    async withdraw(req, res, next) {
        try {
            const result = await MerchantService.withdraw(req.bingoldToken, req.body || {});
            res.status(201).json({ success: true, message: 'Withdrawal requested', data: result });
        } catch (error) { next(error); }
    }

    // ─── Offline KYC (vendor uploads their own documents) ────────
    async submitKyc(req, res, next) {
        try {
            const files = VendorKycService.filesFromMulter(req.files);
            const result = await MerchantService.submitKyc(req.bingoldToken, files);
            res.status(201).json({ success: true, message: 'KYC documents submitted', data: result });
        } catch (error) { next(error); }
    }

    async kycDocuments(req, res, next) {
        try {
            const result = await MerchantService.kycDocuments(req.bingoldToken);
            res.json({ success: true, message: 'KYC documents fetched', data: result });
        } catch (error) { next(error); }
    }
}

module.exports = new MerchantController();
