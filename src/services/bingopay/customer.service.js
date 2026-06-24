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
const PendingReg = require('./pending-registration.service');
const { hashPassword, comparePassword } = require('../../utils/hash.util');

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

    // Step 1 of the entry flow: does this email already have a BinGold account?
    // Uses the external get_profile (server-to-server); a 2xx with a profile id
    // means the user exists. Syncs the shared uuid into the local mapping.
    async checkUser(email) {
        if (!email) throw new ApiError(400, 'email is required');

        try {
            // Fetches the live profile AND caches it locally (status, kyc,
            // wallet addresses, full snapshot) — same data on both platforms.
            const synced = await UserSync.syncFromExternalProfile(email);
            await this._log('user_exists', { email }, synced.raw, 'success', { bingopay_user_id: synced.user && synced.user.id });
            return {
                exists: true,
                hasLocalProfile: true,
                profile: synced.user,
                walletAddresses: synced.walletAddresses,
                bigoldBalance: synced.bigoldBalance,
                raw: synced.raw
            };
        } catch (err) {
            // get_profile errors for unknown emails — treat as "does not exist".
            await this._log('user_exists', { email }, { error: err.message }, 'failed');
            const local = await BingopayUser.findOne({ where: { email } });
            return { exists: false, hasLocalProfile: Boolean(local), profile: local, raw: null };
        }
    }

    // New-user flow, phase 1 of 2 (OTP-gated):
    //   1) make sure the email isn't already registered (user_exists),
    //   2) trigger BinGold signup so it sends the OTP + welcome mail,
    //   3) stash the submitted data (password encrypted) as a pending row.
    // The identity is NOT created yet — that happens in verifyOtp() via
    // register_user once the OTP is confirmed.
    async register(payload) {
        const required = ['firstName', 'lastName', 'password', 'countryId', 'email', 'phoneNumber'];
        for (const f of required) if (!payload[f]) throw new ApiError(400, `${f} is required`);

        // 1) Reject emails that already have a BinGold account.
        let exists = false;
        try {
            const existsResp = await BingoldApi.userExists(payload.email);
            const d = existsResp && (existsResp.data ?? existsResp);
            exists = typeof d === 'boolean' ? d : Boolean(d && (d.exists ?? d.userExists ?? d.isExist ?? d.status));
        } catch (_) { /* treat an errored check as "unknown"; do not block signup */ }
        if (exists) throw new ApiError(409, 'A user with this email already exists. Please login.');

        // BinGold signup requires confirmPassword; default it to password when the
        // client doesn't send it, but reject an explicit mismatch.
        const confirmPassword = payload.confirmPassword ?? payload.password;
        if (confirmPassword !== payload.password) {
            throw new ApiError(400, 'password and confirmPassword do not match');
        }

        const body = {
            email: payload.email,
            password: payload.password,
            confirmPassword,
            firstName: payload.firstName,
            lastName: payload.lastName,
            countryId: String(payload.countryId),
            phoneNumber: payload.phoneNumber,
            userType: 'USER'
        };

        // 2) Ask BinGold to send the OTP + welcome mail (no identity created yet).
        let upstream;
        try {
            upstream = await BingoldApi.signup(body);
        } catch (err) {
            await this._log('signup', body, { error: err.message }, 'failed');
            throw err;
        }

        // 3) Persist the in-flight registration for the verify step to consume.
        await PendingReg.save({
            email: payload.email,
            accountType: 'customer',
            password: payload.password,
            firstName: payload.firstName,
            lastName: payload.lastName,
            phone: payload.phoneNumber,
            countryId: payload.countryId,
            otpType: 'SIGNUP'
        });

        await this._log('signup', body, upstream, 'success');

        return {
            otpSent: true,
            email: payload.email,
            message: 'OTP sent to your email. Verify it to complete registration.',
            bingold: upstream
        };
    }

    // Existing-user flow: authenticate against the local password set at
    // registration, refresh status/uuid from BinGold's external get_profile.
    async login(payload) {
        if (!payload.email || !payload.password) throw new ApiError(400, 'email and password are required');

        const user = await BingopayUser.unscoped().findOne({ where: { email: payload.email } });
        if (!user || !user.password_hash) {
            await this._log('login', { email: payload.email }, { error: 'invalid credentials' }, 'failed');
            throw new ApiError(401, 'Invalid credentials');
        }
        if (!await comparePassword(String(payload.password), user.password_hash)) {
            await this._log('login', { email: payload.email }, { error: 'invalid credentials' }, 'failed');
            throw new ApiError(401, 'Invalid credentials');
        }

        // Best-effort refresh of status + shared uuid from BinGold.
        let upstream = null;
        try {
            upstream = await BingoldApi.getExternalProfile(payload.email);
            const p = (upstream && upstream.data && upstream.data.profile) || {};
            if (p.id && user.uuid !== String(p.id)) await user.update({ uuid: String(p.id) });
        } catch (_) { /* best-effort */ }

        await user.update({ status: 'active', last_login_at: new Date() });
        await this._log('login', { email: payload.email }, upstream, 'success', { bingopay_user_id: user.id });

        return { profile: user, bingold: upstream };
    }

    // Full customer profile: fetch live from BinGold (external get_profile),
    // sync it into our DB, and return the merged view + wallet addresses/balances.
    async getProfile(email) {
        if (!email) throw new ApiError(400, 'email is required');
        try {
            const synced = await UserSync.syncFromExternalProfile(email);
            await this._log('profile', { email }, synced.raw, 'success', { bingopay_user_id: synced.user && synced.user.id });
            return {
                profile: synced.user,
                walletAddresses: synced.walletAddresses,
                balances: synced.balances,
                bigoldBalance: synced.bigoldBalance,
                usdtBalance: synced.usdtBalance,
                bingold: synced.raw,
                profileSyncedAt: synced.syncedAt
            };
        } catch (err) {
            await this._log('profile', { email }, { error: err.message }, 'failed');
            throw err;
        }
    }

    // Add or deduct a BinGold user's marketplace (BIGOD) balance via the external
    // API, then re-sync the local profile so the new balance is reflected.
    //   operation: 'add' | 'deduct'
    async marketplaceBalanceOperation({ email, amount, operation, reference, description } = {}) {
        if (!email) throw new ApiError(400, 'email is required');
        const amt = Number(amount);
        if (!Number.isFinite(amt) || amt <= 0) throw new ApiError(400, 'amount must be a positive number');
        const op = String(operation || '').toLowerCase();
        if (!['add', 'deduct'].includes(op)) throw new ApiError(400, "operation must be 'add' or 'deduct'");

        const body = { email, amount: amt, operation: op, reference, description };

        let upstream;
        try {
            upstream = await BingoldApi.marketplaceBalanceOperation(body);
        } catch (err) {
            await this._log(`balance_${op}`, body, { error: err.message }, 'failed');
            throw err;
        }

        // Refresh the cached profile/balance after the movement (best-effort).
        let synced = null;
        try { synced = await UserSync.syncFromExternalProfile(email); } catch (_) { /* best-effort */ }

        await this._log(`balance_${op}`, body, upstream, 'success', { bingopay_user_id: synced && synced.user && synced.user.id });

        return {
            result: upstream,
            operation: op,
            amount: amt,
            reference: reference || null,
            bigoldBalance: synced ? synced.bigoldBalance : undefined,
            balances: synced ? synced.balances : undefined
        };
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

        // Phase 2 of the OTP-gated signup: if a pending registration exists for
        // this email, the OTP just confirmed it — now create the BinGold identity
        // via register_user, mirror it locally, and clear the pending row.
        const pending = await PendingReg.find(payload.email);
        if (pending && pending.accountType === 'customer') {
            let identity;
            try {
                identity = await UserSync.registerExternalIdentity({
                    email: pending.email,
                    password: pending.password,
                    firstName: pending.firstName,
                    lastName: pending.lastName,
                    countryId: pending.countryId,
                    phone: pending.phone,
                    userType: 'USER'
                });
            } catch (err) {
                await this._log('signup', { email: pending.email }, { error: err.message }, 'failed');
                throw err;
            }

            const password_hash = await hashPassword(String(pending.password));
            const local = await this._upsertLocalUser({
                uuid: identity.uuid || undefined,
                email: pending.email,
                phone: pending.phone,
                first_name: pending.firstName,
                last_name: pending.lastName,
                password_hash,
                account_type: 'customer',
                status: 'active',
                markLogin: true
            });

            await PendingReg.remove(pending.email);
            await this._log('verify_otp', body, upstream, 'success', { bingopay_user_id: local && local.id });
            return {
                registered: true,
                bingold: identity.raw,
                profile: local,
                token: identity.token || extractToken(upstream)
            };
        }

        // No pending registration — a plain OTP verify (login / 2fa / email change).
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
