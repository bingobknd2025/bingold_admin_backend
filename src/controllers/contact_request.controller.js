// controllers/contact_request.controller.js
//
// Admin surface for "contact us" tickets. JWT + permission gated.
const ContactRequestService = require('../services/contact-request.service');
const ApiError = require('../utils/apiError.util');

class ContactRequestController {
    async list(req, res, next) {
        try {
            const { page, limit, ...filters } = req.body;
            const result = await ContactRequestService.getList(
                parseInt(page, 10) || 1,
                parseInt(limit, 10) || 10,
                filters
            );
            res.json({ success: true, message: 'Contact requests retrieved successfully', data: result });
        } catch (error) { next(error); }
    }

    async counts(req, res, next) {
        try {
            const data = await ContactRequestService.getCounts();
            res.json({ success: true, message: 'Contact request counts retrieved successfully', data });
        } catch (error) { next(error); }
    }

    async view(req, res, next) {
        try {
            const { id } = req.body;
            if (!id) throw new ApiError(400, 'Contact request id is required');
            const data = await ContactRequestService.getById(id);
            res.json({ success: true, message: 'Contact request fetched successfully', data });
        } catch (error) { next(error); }
    }

    async updateStatus(req, res, next) {
        try {
            const { id, status, admin_note } = req.body;
            const data = await ContactRequestService.updateStatus(
                id,
                status,
                admin_note,
                req.user?.pda_user_id
            );
            res.json({ success: true, message: 'Contact request updated successfully', data });
        } catch (error) { next(error); }
    }

    async remove(req, res, next) {
        try {
            const { id } = req.body;
            const data = await ContactRequestService.remove(id);
            res.json({ success: true, message: 'Contact request deleted successfully', data });
        } catch (error) { next(error); }
    }
}

module.exports = new ContactRequestController();
