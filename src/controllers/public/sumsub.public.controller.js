// controllers/public/sumsub.public.controller.js
//
// Inbound Sumsub KYC webhook. Mounted BEFORE the api-key / JWT middleware
// because Sumsub authenticates via the x-payload-digest HMAC header, not our
// api key. Always returns 200 quickly so Sumsub does not retry-storm; failures
// are logged server-side.
const VendorService = require('../../services/bingopay/vendor.service');
const SumsubService = require('../../services/bingopay/sumsub.service');

class SumsubPublicController {
    async handleWebhook(req, res) {
        try {
            const signature = req.headers['x-payload-digest'];
            const algo = req.headers['x-payload-digest-alg'] || 'HMAC_SHA256_HEX';

            // req.rawBody is captured by the express.json verify hook in app.js.
            const valid = SumsubService.verifyWebhookSignature(req.rawBody, signature, algo);
            if (!valid) {
                return res.status(401).json({ success: false, message: 'Invalid webhook signature' });
            }

            const result = await VendorService.applyKycWebhook(req.body || {});
            return res.status(200).json({ success: true, message: 'Webhook processed', data: result });
        } catch (error) {
            // Never surface a 5xx that would make Sumsub retry indefinitely.
            console.error('Sumsub webhook error:', error);
            return res.status(200).json({ success: false, message: 'Webhook received with errors' });
        }
    }
}

module.exports = new SumsubPublicController();
