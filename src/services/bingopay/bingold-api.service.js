
const ApiError = require('../../utils/apiError.util');

const BASE_URL = (process.env.BINGOLD_API_BASE_URL || 'https://api-mobile-stage.gldbst.com').replace(/\/+$/, '');
const PREFIX = process.env.BINGOLD_API_PREFIX || '/user/api/v1';
// How the user's BinGold session token is sent on authenticated calls.
const AUTH_HEADER = process.env.BINGOLD_AUTH_HEADER || 'Authorization';
const AUTH_SCHEME = process.env.BINGOLD_AUTH_SCHEME ?? 'Bearer'; // set '' for raw token
const TIMEOUT_MS = parseInt(process.env.BINGOLD_API_TIMEOUT_MS, 10) || 20000;

// Server-to-server "external" API (separate deployment) used for marketplace
// onboarding: it is authed by an x-api-key (no user token / no OTP) and
// register_user returns the BinGold UUID + token synchronously. Falls back to
// the main base URL if a dedicated one isn't configured.
const EXTERNAL_BASE_URL = (process.env.BINGOLD_EXTERNAL_BASE_URL || BASE_URL).replace(/\/+$/, '');
const EXTERNAL_API_KEY = process.env.BINGOLD_EXTERNAL_API_KEY || '';

class BingoldApiService {
    _url(path, baseUrl) {
        return `${baseUrl || BASE_URL}${PREFIX}${path.startsWith('/') ? path : '/' + path}`;
    }

    _authValue(token) {
        return AUTH_SCHEME ? `${AUTH_SCHEME} ${token}` : token;
    }

    async request(method, path, { body, token, query, apiKey, baseUrl } = {}) {
        let url = this._url(path, baseUrl);
        if (query && Object.keys(query).length) {
            const qs = new URLSearchParams(
                Object.entries(query).filter(([, v]) => v !== undefined && v !== null)
            ).toString();
            if (qs) url += `?${qs}`;
        }

        const headers = { 'Accept': 'application/json' };
        if (body !== undefined) headers['Content-Type'] = 'application/json';
        if (apiKey) headers['x-api-key'] = apiKey;
        if (token) headers[AUTH_HEADER] = this._authValue(token);

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

        let res;
        try {
            res = await fetch(url, {
                method,
                headers,
                body: body !== undefined ? JSON.stringify(body) : undefined,
                signal: controller.signal
            });
        } catch (err) {
            clearTimeout(timer);
            if (err.name === 'AbortError') throw new ApiError(504, 'BinGold API timed out');
            throw new ApiError(502, `BinGold API unreachable: ${err.message}`);
        }
        clearTimeout(timer);

        const text = await res.text();
        let json;
        try { json = text ? JSON.parse(text) : {}; } catch (_) { json = { raw: text }; }

        if (!res.ok) {
            const message = (json && (json.message || json.error || json.description)) || `BinGold API error (${res.status})`;
            throw new ApiError(res.status, Array.isArray(message) ? message.join(', ') : String(message));
        }
        return json;
    }

    // ─── External (server-to-server, x-api-key) ──────────────────
    // These power the marketplace onboarding flow and are NOT user/OTP gated.
    isExternalEnabled() {
        return Boolean(EXTERNAL_API_KEY);
    }

    _external(method, path, body) {
        if (!EXTERNAL_API_KEY) {
            throw new ApiError(501, 'BinGold external API is not configured (set BINGOLD_EXTERNAL_API_KEY)');
        }
        return this.request(method, path, { body, apiKey: EXTERNAL_API_KEY, baseUrl: EXTERNAL_BASE_URL });
    }

    // Create a BinGold identity. userType: 'USER' | 'VENDOR'. Returns
    // { data: { id (uuid), email, userRole, clientId, token } } synchronously.
    registerExternalUser(payload) {
        return this._external('POST', '/external/register_user', payload);
    }

    // Full profile + balances for an email (server-to-server).
    getExternalProfile(email) {
        return this._external('POST', '/external/get_profile', { email });
    }

    // Credit/debit a user's marketplace balance. operation: 'add' | 'deduct'.
    marketplaceBalanceOperation({ email, amount, operation, reference, description }) {
        return this._external('POST', '/external/marketplace_balance_operation', {
            email, amount, operation, reference, description
        });
    }

    // ─── Auth ────────────────────────────────────────────────────
    userExists(email) {
        return this.request('POST', '/auth/user_exists', { body: { email } });
    }

    signup(payload) {
        return this.request('POST', '/auth/signup', { body: payload });
    }

    login(payload) {
        return this.request('POST', '/auth/login', { body: payload });
    }

    verifyOtp(payload) {
        return this.request('POST', '/auth/verify_otp', { body: payload });
    }

    resendOtp(payload) {
        return this.request('POST', '/auth/resend_otp', { body: payload });
    }

    forgotPassword(email) {
        return this.request('POST', '/auth/forgot_password', { body: { email } });
    }

    pinLogin(payload) {
        return this.request('POST', '/auth/pin_login', { body: payload });
    }

    // ─── User / Wallet (require the user's BinGold token) ─────────
    getProfile(token) {
        return this.request('GET', '/user/profile', { token });
    }

    // portfolioBalance: 1 = full portfolio, 0 = single — mirrors the mobile app.
    getBalance(token, portfolioBalance = 1) {
        return this.request('GET', '/user/balance', { token, query: { portfolioBalance } });
    }

    getKycSettings(token) {
        return this.request('GET', '/user/kyc_settings', { token });
    }

    // Wallet ledger / transaction history. type e.g. deposit|withdraw|buy.
    transactionHistory(token, { type, coin, coinSymbol, page = 1, size } = {}) {
        return this.request('POST', '/transaction/history', {
            token,
            body: { type, coin, coinSymbol, page, ...(size ? { size } : {}) }
        });
    }

    // Settlement out: requires KYC approved + 2FA on the BinGold side.
    withdrawRequest(token, { amount, coin, address, note }) {
        return this.request('POST', '/transaction/withdraw_request', {
            token,
            body: { amount, coin, address, note }
        });
    }

    // ─── Pricing / conversion ────────────────────────────────────
    // Token price conversion (BIGOD <-> USDT/BNB/ETH...). Public endpoint; the
    // exact query params are undocumented, so we pass through whatever we get and
    // let the caller parse defensively.
    buyTokenPriceConversion(query = {}) {
        return this.request('GET', '/buy/buy_token_price_conversion', { query });
    }

    // ─── Wallet-to-wallet transfer (the one missing BinGold capability) ──
    // There is no transfer endpoint in the documented API yet. This adapter
    // targets a configurable path so that when BinGold ships it, BingoPay goes
    // live by setting BINGOLD_TRANSFER_PATH (e.g. '/payment/transfer' or
    // '/wallet/transfer') — no code change required.
    isTransferEnabled() {
        return Boolean(process.env.BINGOLD_TRANSFER_PATH);
    }

    walletTransfer(token, payload) {
        const path = process.env.BINGOLD_TRANSFER_PATH;
        if (!path) {
            throw new ApiError(501, 'Wallet transfer is not available yet: BinGold has no transfer API (set BINGOLD_TRANSFER_PATH once it exists)');
        }
        const method = (process.env.BINGOLD_TRANSFER_METHOD || 'POST').toUpperCase();
        return this.request(method, path, { token, body: payload });
    }
}

module.exports = new BingoldApiService();
module.exports.config = { BASE_URL, PREFIX, AUTH_HEADER, AUTH_SCHEME, EXTERNAL_BASE_URL, EXTERNAL_ENABLED: Boolean(EXTERNAL_API_KEY) };
