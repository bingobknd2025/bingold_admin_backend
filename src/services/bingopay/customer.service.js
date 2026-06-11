// services/bingopay/customer.service.js
//
// BingoPay customer onboarding / SSO. Wraps the BinGold auth endpoints and
// keeps a local bingopay_users mapping row in sync. Every interaction is
// recorded in sso_sync_logs (with secrets redacted) for audit/debugging.
const db = require('../../models');
const { BingopayUser, SsoSyncLog } = db;
const ApiError = require('../../utils/apiError.util');
const BingoldApi = require('./bingold-api.service');
const UserSync = require('./user-sync.service');

const SECRET_KEYS = ['password', 'confirmPassword', 'pin', 'confirmPin', 'otp', 'tOtp',
    'token', 'access_token', 'accessToken', 'refresh_token', 'refreshToken',
    'google2faSecret', 'recaptchaToken'];

function redact(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    const out = Array.isArray(obj) ? [] : {};
    for (const [k, v] of Object.entries(obj)) {
        if (SECRET_KEYS.includes(k)) out[k] = '***';
        else if (v && typeof v === 'object') out[k] = redact(v);
        else out[k] = v;
    }
    return out;
}

// Best-effort extraction of the session token from an undocumented login/otp
// response. Checks the common shapes used by NestJS auth services.
function extractToken(resp) {
    if (!resp || typeof resp !== 'object') return null;
    const d = resp.data || resp;
    return d.token || d.accessToken || d.access_token ||
        (d.tokens && (d.tokens.access || d.tokens.accessToken || d.tokens.access_token)) ||
        (d.auth && (d.auth.token || d.auth.accessToken)) || null;
}

// Best-effort extraction of the BinGold user id from a response.
function extractUserId(resp) {
    if (!resp || typeof resp !== 'object') return null;
    const d = resp.data || resp;
    const u = d.user || d.profile || d;
    const id = u.id ?? u.userId ?? u.user_id ?? u._id;
    return id != null ? id : null;
}

class CustomerService {
    async _log(request_type, request_payload, response_payload, sync_status, ids = {}) {
        try {
            await SsoSyncLog.create({
                bingopay_user_id: ids.bingopay_user_id || null,
                bingold_user_id: ids.bingold_user_id || null,
                request_type,
                request_payload: redact(request_payload),
                response_payload: redact(response_payload),
                sync_status
            });
        } catch (_) { /* logging must never break the flow */ }
    }

    // Upsert the local mapping row (delegates to the shared user-sync helper so
    // every service writes bingopay_users the same way).
    async _upsertLocalUser(data) {
        return UserSync.upsertUser(data);
    }

    // Step 1 of the BingoPay entry flow: does this email already have a BinGold
    // account? Also reports whether we have a local mapping yet.
    async checkUser(email) {
        if (!email) throw new ApiError(400, 'email is required');

        let exists = false;
        let upstream;
        try {
            upstream = await BingoldApi.userExists(email);
            // Endpoint returns truthy/exists flag in an undocumented shape; treat
            // any successful 2xx with an explicit false as "does not exist".
            const d = upstream && (upstream.data ?? upstream);
            exists = typeof d === 'boolean' ? d
                : (d && (d.exists ?? d.userExists ?? d.isExist ?? d.status)) ?? true;
            await this._log('user_exists', { email }, upstream, 'success');
        } catch (err) {
            await this._log('user_exists', { email }, { error: err.message }, 'failed');
            throw err;
        }

        // If the user exists on BinGold, make sure we have a local DB entry for
        // them; otherwise just report whatever local row we may already have.
        let local;
        if (exists) {
            local = await this._upsertLocalUser({
                email,
                bingold_user_id: extractUserId(upstream),
                account_type: 'customer',
                status: 'active'
            });
        } else {
            local = await BingopayUser.findOne({ where: { email } });
        }

        return { exists: Boolean(exists), hasLocalProfile: Boolean(local), profile: local, raw: upstream };
    }

    // New-user flow: register the customer in BinGold, then create the local
    // mapping in 'pending' state (activated after OTP / login).
    async register(payload) {
        const required = ['firstName', 'lastName', 'password', 'confirmPassword', 'countryId', 'email', 'phoneNumber'];
        for (const f of required) if (!payload[f]) throw new ApiError(400, `${f} is required`);

        const body = {
            firstName: payload.firstName,
            lastName: payload.lastName,
            password: payload.password,
            confirmPassword: payload.confirmPassword,
            countryId: payload.countryId,
            email: payload.email,
            phoneNumber: payload.phoneNumber,
            type: payload.type ?? 1,
            signup_as: payload.signup_as ?? 1,
            recaptchaToken: payload.recaptchaToken,
            ...(payload.referrerCode ? { referrerCode: payload.referrerCode } : {})
        };

        let upstream;
        try {
            upstream = await BingoldApi.signup(body);
        } catch (err) {
            await this._log('signup', body, { error: err.message }, 'failed');
            throw err;
        }

        const local = await this._upsertLocalUser({
            email: payload.email,
            phone: payload.phoneNumber,
            first_name: payload.firstName,
            last_name: payload.lastName,
            bingold_user_id: extractUserId(upstream),
            account_type: 'customer',
            status: 'pending'
        });

        await this._log('signup', body, upstream, 'success', {
            bingopay_user_id: local && local.id,
            bingold_user_id: local && local.bingold_user_id
        });

        return { bingold: upstream, profile: local };
    }

    // Existing-user flow: authenticate against BinGold, sync local mapping to
    // 'active', and return the BinGold tokens for the client to use on wallet calls.
    async login(payload) {
        if (!payload.email || !payload.password) throw new ApiError(400, 'email and password are required');

        const body = {
            email: payload.email,
            password: payload.password,
            recaptchaToken: payload.recaptchaToken
        };

        let upstream;
        try {
            upstream = await BingoldApi.login(body);
        } catch (err) {
            await this._log('login', body, { error: err.message }, 'failed');
            throw err;
        }

        const bingold_user_id = extractUserId(upstream);
        const token = extractToken(upstream);

        // Only mark 'active' once we have a session; OTP-gated logins stay pending.
        const local = await this._upsertLocalUser({
            email: payload.email,
            bingold_user_id,
            account_type: 'customer',
            status: token ? 'active' : 'pending',
            markLogin: Boolean(token)
        });

        await this._log('login', body, upstream, 'success', {
            bingopay_user_id: local && local.id,
            bingold_user_id: local && local.bingold_user_id
        });

        return { bingold: upstream, profile: local, otpRequired: !token };
    }

    async verifyOtp(payload) {
        if (!payload.email || !payload.otp) throw new ApiError(400, 'email and otp are required');
        const body = {
            email: payload.email,
            type: payload.type,
            otp: payload.otp,
            ...(payload.tOtp ? { tOtp: payload.tOtp } : {}),
            ...(payload.newEmail ? { newEmail: payload.newEmail } : {}),
            ...(payload.google2faSecret ? { google2faSecret: payload.google2faSecret } : {}),
            ...(payload.token ? { token: payload.token } : {})
        };

        let upstream;
        try {
            upstream = await BingoldApi.verifyOtp(body);
        } catch (err) {
            await this._log('verify_otp', body, { error: err.message }, 'failed');
            throw err;
        }

        const token = extractToken(upstream);
        const local = await this._upsertLocalUser({
            email: payload.email,
            bingold_user_id: extractUserId(upstream),
            status: token ? 'active' : undefined,
            markLogin: Boolean(token)
        });

        await this._log('verify_otp', body, upstream, 'success', {
            bingopay_user_id: local && local.id,
            bingold_user_id: local && local.bingold_user_id
        });

        return { bingold: upstream, profile: local };
    }

    async resendOtp(payload) {
        if (!payload.email) throw new ApiError(400, 'email is required');
        const body = { email: payload.email, type: payload.type };
        const upstream = await BingoldApi.resendOtp(body);
        await this._log('resend_otp', body, upstream, 'success');
        return upstream;
    }
}

module.exports = new CustomerService();
