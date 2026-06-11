// services/bingopay/wallet.service.js
//
// Read-through wallet access for BingoPay customers. BinGold is the source of
// truth: we never store balances or a ledger locally, we proxy the user's
// authenticated calls. `token` is the caller's BinGold session token.
//
// Every operation is recorded in sso_sync_logs (via audit.service) so all
// wallet activity is kept in our database, even though balances live in BinGold.
const ApiError = require('../../utils/apiError.util');
const BingoldApi = require('./bingold-api.service');
const Audit = require('./audit.service');
const UserSync = require('./user-sync.service');

// A successful authenticated wallet call means the caller is a real, active
// BinGold user — make sure we have a bingopay_users row for them. Best-effort:
// only runs when the client supplied an email, and never breaks the response.
async function ensureUser(email, patch = {}) {
    if (!email) return;
    try { await UserSync.upsertUser({ email, account_type: 'customer', status: 'active', ...patch }); }
    catch (_) { /* swallow */ }
}

class WalletService {
    async getBalance(token, portfolioBalance = 1, meta = {}) {
        if (!token) throw new ApiError(401, 'BinGold session token is required');
        try {
            const res = await BingoldApi.getBalance(token, portfolioBalance);
            await ensureUser(meta.email);
            await Audit.log({ request_type: 'balance', request_payload: { portfolioBalance }, response_payload: res, sync_status: 'success', email: meta.email });
            return res;
        } catch (err) {
            await Audit.log({ request_type: 'balance', request_payload: { portfolioBalance }, response_payload: { error: err.message }, sync_status: 'failed', email: meta.email });
            throw err;
        }
    }

    async getProfile(token, meta = {}) {
        if (!token) throw new ApiError(401, 'BinGold session token is required');
        try {
            const res = await BingoldApi.getProfile(token);
            await ensureUser(meta.email);
            await Audit.log({ request_type: 'profile', request_payload: {}, response_payload: res, sync_status: 'success', email: meta.email });
            return res;
        } catch (err) {
            await Audit.log({ request_type: 'profile', request_payload: {}, response_payload: { error: err.message }, sync_status: 'failed', email: meta.email });
            throw err;
        }
    }

    // Wallet ledger = transaction history (deposits / withdrawals / buys).
    async getLedger(token, filters = {}) {
        if (!token) throw new ApiError(401, 'BinGold session token is required');
        const req = {
            type: filters.type,
            coin: filters.coin,
            coinSymbol: filters.coinSymbol,
            page: parseInt(filters.page, 10) || 1,
            size: filters.size
        };
        try {
            const res = await BingoldApi.transactionHistory(token, req);
            await ensureUser(filters.email);
            await Audit.log({ request_type: 'ledger', request_payload: req, response_payload: res, sync_status: 'success', email: filters.email });
            return res;
        } catch (err) {
            await Audit.log({ request_type: 'ledger', request_payload: req, response_payload: { error: err.message }, sync_status: 'failed', email: filters.email });
            throw err;
        }
    }

    // Settlement-out. BinGold enforces KYC-approved + 2FA; surfaced errors pass
    // through with the upstream message.
    async withdraw(token, payload = {}) {
        if (!token) throw new ApiError(401, 'BinGold session token is required');
        if (payload.amount == null || Number(payload.amount) <= 0) throw new ApiError(400, 'amount must be greater than 0');
        if (!payload.coin) throw new ApiError(400, 'coin is required');
        if (!payload.address) throw new ApiError(400, 'address is required');

        const req = { amount: payload.amount, coin: payload.coin, address: payload.address, note: payload.note || null };
        try {
            const res = await BingoldApi.withdrawRequest(token, req);
            await ensureUser(payload.email);
            await Audit.log({ request_type: 'withdraw_request', request_payload: req, response_payload: res, sync_status: 'success', email: payload.email });
            return res;
        } catch (err) {
            await Audit.log({ request_type: 'withdraw_request', request_payload: req, response_payload: { error: err.message }, sync_status: 'failed', email: payload.email });
            throw err;
        }
    }
}

module.exports = new WalletService();
