// controllers/public/contact.public.controller.js
//
// Public "contact us" submission. UNAUTHENTICATED — no x-api-key, no JWT — so
// it can be posted from any site or third-party platform. Rate limiting sits on
// the route; validation sits in the service.
const ContactRequestService = require('../../services/contact-request.service');

class ContactPublicController {
    async submit(req, res, next) {
        try {
            const result = await ContactRequestService.submit(req.body, {
                // trust proxy is on (app.js), so req.ip is the real client IP.
                ip: req.ip,
                userAgent: req.headers['user-agent']
            });

            res.status(201).json({
                success: true,
                message: 'Your request has been received. Our team will get back to you shortly.',
                data: result
            });
        } catch (error) { next(error); }
    }
}

module.exports = new ContactPublicController();
