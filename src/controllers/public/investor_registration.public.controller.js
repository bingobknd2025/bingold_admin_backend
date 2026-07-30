// controllers/public/investor_registration.public.controller.js
//
// Consumed by the investor-ui. The browser never calls these directly — the
// investor-ui proxies through its own Next.js route handlers so the x-api-key
// stays server-side.
const InvestorRegistrationService = require('../../services/investor-registration.service');
const ApiError = require('../../utils/apiError.util');

class InvestorRegistrationPublicController {
    // Called immediately after the investor backend accepted a signup.
    async capture(req, res, next) {
        try {
            const result = await InvestorRegistrationService.capture(req.body);
            res.json({ success: true, message: 'Investor registration captured', data: result });
        } catch (error) { next(error); }
    }

    // Called after the signup OTP was verified.
    async verified(req, res, next) {
        try {
            const { email } = req.body;
            if (!email) throw new ApiError(400, 'email is required');
            const result = await InvestorRegistrationService.markVerified(email);
            res.json({ success: true, message: 'Investor registration updated', data: result });
        } catch (error) { next(error); }
    }

    // Drives the investor-ui login redirect. POST (not GET) so the email is not
    // logged in URLs or proxy access logs.
    async status(req, res, next) {
        try {
            const { email } = req.body;
            if (!email) throw new ApiError(400, 'email is required');
            const result = await InvestorRegistrationService.getStatus(email);
            res.json({ success: true, message: 'Investor registration status', data: result });
        } catch (error) { next(error); }
    }

    // Multipart: the company profile plus one file per attached document type
    // (field name === doc_type).
    async uploadDocuments(req, res, next) {
        try {
            const { email, company_details: companyDetails, document_types: documentTypes } = req.body;
            if (!email) throw new ApiError(400, 'email is required');

            const result = await InvestorRegistrationService.saveDocuments(
                email,
                companyDetails,
                documentTypes,
                req.files || {}
            );
            res.json({ success: true, message: 'Company registration submitted successfully', data: result });
        } catch (error) { next(error); }
    }

    // Lets the investor-ui render its form from the backend definition.
    async requirements(req, res, next) {
        try {
            res.json({
                success: true,
                message: 'Company registration requirements',
                data: {
                    document_types: InvestorRegistrationService.DOCUMENT_TYPES,
                    company_fields: InvestorRegistrationService.COMPANY_FIELDS
                }
            });
        } catch (error) { next(error); }
    }
}

module.exports = new InvestorRegistrationPublicController();
