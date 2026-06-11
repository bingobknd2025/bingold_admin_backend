// services/bingopay/audit.service.js
//
// Single place that records every BinGold interaction into sso_sync_logs (the
// BinGold-interaction audit trail). Secrets are redacted before persisting.
// Used by the wallet/customer/user services so nothing talks to BinGold without
// leaving a record in our database.
const db = require('../../models');
const { SsoSyncLog, BingopayUser } = db;

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

// Persist one audit row. Never throws — logging must not break the request.
// If `email` is provided we resolve the local bingopay_users row for attribution.
async function log({ request_type, request_payload, response_payload, sync_status, email, bingopay_user_id, bingold_user_id } = {}) {
    try {
        let uid = bingopay_user_id || null;
        let gid = bingold_user_id || null;
        if (!uid && email) {
            const u = await BingopayUser.findOne({ where: { email }, attributes: ['id', 'bingold_user_id'] });
            if (u) { uid = u.id; gid = gid || u.bingold_user_id; }
        }
        await SsoSyncLog.create({
            bingopay_user_id: uid,
            bingold_user_id: gid,
            request_type,
            request_payload: redact(request_payload),
            response_payload: redact(response_payload),
            sync_status
        });
    } catch (_) { /* swallow */ }
}

module.exports = { log, redact };
