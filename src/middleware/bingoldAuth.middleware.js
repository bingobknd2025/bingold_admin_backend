// middleware/bingoldAuth.middleware.js
//
// For BingoPay customer endpoints that proxy authenticated BinGold calls
// (balance, ledger, withdraw). The client forwards its BinGold session token in
// the Authorization header; we extract it as req.bingoldToken. This is NOT the
// admin JWT middleware — it does not validate against pda_users.
module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers['x-bingold-token'];
    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'BinGold session token missing' });
    }
    req.bingoldToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();
    next();
};
