// controllers/bingopay/marketplace.controller.js
//
// Server-to-server endpoints the NestJS marketplace calls to move BIGOD balance
// for orders. Authed by the global x-api-key (no user JWT).
const MarketplaceService = require('../../services/bingopay/marketplace.service');

class MarketplaceController {
    async orderPay(req, res, next) {
        try {
            const data = await MarketplaceService.orderPay(req.body || {});
            res.json({ success: true, message: 'Order payment settled', data });
        } catch (error) { next(error); }
    }

    async orderRefund(req, res, next) {
        try {
            const data = await MarketplaceService.orderRefund(req.body || {});
            res.json({ success: true, message: 'Order refunded', data });
        } catch (error) { next(error); }
    }
}

module.exports = new MarketplaceController();
