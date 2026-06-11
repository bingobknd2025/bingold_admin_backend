// controllers/bingopay/vendor.controller.js
const VendorService = require('../../services/bingopay/vendor.service');
const VendorKycService = require('../../services/bingopay/vendor-kyc.service');
const ApiError = require('../../utils/apiError.util');

class VendorController {
    async create(req, res, next) {
        try {
            if (!req.user || !req.user.pda_user_id) throw new ApiError(401, 'Unauthorized');
            const vendor = await VendorService.createVendor(req.body, req.user.pda_user_id);
            res.status(201).json({ success: true, message: 'Vendor created successfully', data: vendor });
        } catch (error) { next(error); }
    }

    async list(req, res, next) {
        try {
            const { page, limit, ...filters } = req.body;
            const result = await VendorService.getVendorList(parseInt(page, 10) || 1, parseInt(limit, 10) || 10, filters);
            res.json({ success: true, message: 'Vendors retrieved successfully', data: result });
        } catch (error) { next(error); }
    }

    async view(req, res, next) {
        try {
            const { id } = req.body;
            if (!id) throw new ApiError(400, 'Vendor id is required');
            const vendor = await VendorService.getVendorById(id);
            res.json({ success: true, message: 'Vendor fetched successfully', data: vendor });
        } catch (error) { next(error); }
    }

    async update(req, res, next) {
        try {
            if (!req.user || !req.user.pda_user_id) throw new ApiError(401, 'Unauthorized');
            const { id } = req.body;
            if (!id) throw new ApiError(400, 'Vendor id is required');
            const vendor = await VendorService.updateVendor(id, req.body, req.user.pda_user_id);
            res.json({ success: true, message: 'Vendor updated successfully', data: vendor });
        } catch (error) { next(error); }
    }

    async approve(req, res, next) {
        try {
            if (!req.user || !req.user.pda_user_id) throw new ApiError(401, 'Unauthorized');
            const { id } = req.body;
            if (!id) throw new ApiError(400, 'Vendor id is required');
            const vendor = await VendorService.approveVendor(id, req.user.pda_user_id);
            res.json({ success: true, message: 'Vendor approved successfully', data: vendor });
        } catch (error) { next(error); }
    }

    async reject(req, res, next) {
        try {
            if (!req.user || !req.user.pda_user_id) throw new ApiError(401, 'Unauthorized');
            const { id, reason } = req.body;
            if (!id) throw new ApiError(400, 'Vendor id is required');
            const vendor = await VendorService.rejectVendor(id, reason, req.user.pda_user_id);
            res.json({ success: true, message: 'Vendor rejected', data: vendor });
        } catch (error) { next(error); }
    }

    async changeStatus(req, res, next) {
        try {
            const { id, status } = req.body;
            if (!id) throw new ApiError(400, 'Vendor id is required');
            if (!status) throw new ApiError(400, 'status is required');
            const vendor = await VendorService.setStatus(id, status);
            res.json({ success: true, message: 'Vendor status updated', data: vendor });
        } catch (error) { next(error); }
    }

    async initiateKyc(req, res, next) {
        try {
            const { id } = req.body;
            if (!id) throw new ApiError(400, 'Vendor id is required');
            const result = await VendorService.initiateKyc(id);
            res.json({ success: true, message: 'KYC initiated', data: result });
        } catch (error) { next(error); }
    }

    // ─── Offline KYC (admin submits / reviews on the vendor's behalf) ──
    async submitKycDocuments(req, res, next) {
        try {
            if (!req.user || !req.user.pda_user_id) throw new ApiError(401, 'Unauthorized');
            const vendorId = req.body.vendor_id || req.body.id;
            if (!vendorId) throw new ApiError(400, 'vendor_id is required');
            const files = VendorKycService.filesFromMulter(req.files);
            const result = await VendorKycService.submitDocuments(vendorId, files, { adminId: req.user.pda_user_id });
            res.status(201).json({ success: true, message: 'KYC documents submitted', data: result });
        } catch (error) { next(error); }
    }

    async kycDocuments(req, res, next) {
        try {
            const vendorId = req.body.vendor_id || req.body.id;
            if (!vendorId) throw new ApiError(400, 'vendor_id is required');
            const result = await VendorKycService.getDocuments(vendorId);
            res.json({ success: true, message: 'KYC documents fetched', data: result });
        } catch (error) { next(error); }
    }

    async reviewKycDocument(req, res, next) {
        try {
            const { document_id, status, note } = req.body;
            if (!document_id) throw new ApiError(400, 'document_id is required');
            if (!status) throw new ApiError(400, 'status is required');
            const doc = await VendorKycService.reviewDocument(document_id, status, note);
            res.json({ success: true, message: 'Document reviewed', data: doc });
        } catch (error) { next(error); }
    }
}

module.exports = new VendorController();
