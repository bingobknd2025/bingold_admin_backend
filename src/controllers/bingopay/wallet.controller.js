// controllers/bingopay/wallet.controller.js
//
// Customer-facing wallet proxy. Requires req.bingoldToken (bingoldAuth middleware).
const WalletService = require('../../services/bingopay/wallet.service');

class WalletController {
    async balance(req, res, next) {
        try {
            const portfolioBalance = req.body.portfolioBalance ?? req.query.portfolioBalance ?? 1;
            const result = await WalletService.getBalance(req.bingoldToken, portfolioBalance, { email: req.body.email });
            res.json({ success: true, message: 'Balance fetched', data: result });
        } catch (error) { next(error); }
    }

    async profile(req, res, next) {
        try {
            const result = await WalletService.getProfile(req.bingoldToken, { email: req.body.email || req.query.email });
            res.json({ success: true, message: 'Profile fetched', data: result });
        } catch (error) { next(error); }
    }

    async ledger(req, res, next) {
        try {
            const result = await WalletService.getLedger(req.bingoldToken, req.body || {});
            res.json({ success: true, message: 'Wallet ledger fetched', data: result });
        } catch (error) { next(error); }
    }

    async withdraw(req, res, next) {
        try {
            const result = await WalletService.withdraw(req.bingoldToken, req.body || {});
            res.status(201).json({ success: true, message: 'Withdrawal requested', data: result });
        } catch (error) { next(error); }
    }
}

module.exports = new WalletController();
