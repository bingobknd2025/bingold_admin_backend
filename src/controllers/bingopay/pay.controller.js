// controllers/bingopay/pay.controller.js
//
// Customer payment flow. resolve/quote are read-only (no BinGold token needed);
// confirm requires the payer's BinGold token via bingoldAuth (req.bingoldToken).
const PayService = require('../../services/bingopay/pay.service');
const ApiError = require('../../utils/apiError.util');

class PayController {
    async resolve(req, res, next) {
        try {
            const qrUuid = req.params.qrUuid || req.body.qrUuid;
            if (!qrUuid) throw new ApiError(400, 'qrUuid is required');
            const data = await PayService.resolveQr(qrUuid);
            res.json({ success: true, message: 'Merchant resolved', data });
        } catch (error) { next(error); }
    }

    async quote(req, res, next) {
        try {
            const { qrUuid, payCoin, amount } = req.body;
            const data = await PayService.quote({ qrUuid, payCoin, amount });
            res.json({ success: true, message: 'Quote generated', data });
        } catch (error) { next(error); }
    }

    async confirm(req, res, next) {
        try {
            const data = await PayService.confirm(req.bingoldToken, req.body || {});
            res.status(201).json({
                success: true,
                message: data.transferPending ? 'Payment recorded, awaiting transfer settlement' : 'Payment successful',
                data
            });
        } catch (error) { next(error); }
    }
}

module.exports = new PayController();
