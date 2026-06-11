// services/bingopay/sumsub.service.js
//
// Thin Sumsub client + webhook helper. Credentials are optional: if they are
// not configured the API-calling methods throw a clear error, while webhook
// verification falls back to "accept" only when no secret is set (so local/dev
// works, production with a secret is verified). This reuses the same Sumsub
// account already used elsewhere in the BinGold ecosystem.
const crypto = require('crypto');
const ApiError = require('../../utils/apiError.util');

const SUMSUB_BASE_URL = process.env.SUMSUB_BASE_URL || 'https://api.sumsub.com';
const SUMSUB_APP_TOKEN = process.env.SUMSUB_APP_TOKEN || '';
const SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY || '';
const SUMSUB_WEBHOOK_SECRET = process.env.SUMSUB_WEBHOOK_SECRET || '';
// Level name configured in the Sumsub dashboard for vendor/business KYB.
const SUMSUB_VENDOR_LEVEL = process.env.SUMSUB_VENDOR_LEVEL_NAME || 'basic-kyb-level';

class SumsubService {
    isConfigured() {
        return Boolean(SUMSUB_APP_TOKEN && SUMSUB_SECRET_KEY);
    }

    // Build the signed headers Sumsub requires for every API call.
    _signedHeaders(method, path, bodyString = '') {
        const ts = Math.floor(Date.now() / 1000);
        const signature = crypto
            .createHmac('sha256', SUMSUB_SECRET_KEY)
            .update(ts + method.toUpperCase() + path + bodyString)
            .digest('hex');

        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-App-Token': SUMSUB_APP_TOKEN,
            'X-App-Access-Sig': signature,
            'X-App-Access-Ts': String(ts)
        };
    }

    async _request(method, path, body) {
        if (!this.isConfigured()) {
            throw new ApiError(503, 'Sumsub is not configured (set SUMSUB_APP_TOKEN and SUMSUB_SECRET_KEY)');
        }
        const bodyString = body ? JSON.stringify(body) : '';
        const res = await fetch(SUMSUB_BASE_URL + path, {
            method,
            headers: this._signedHeaders(method, path, bodyString),
            body: bodyString || undefined
        });

        const text = await res.text();
        let json;
        try { json = text ? JSON.parse(text) : {}; } catch (_) { json = { raw: text }; }

        if (!res.ok) {
            const message = json && (json.description || json.message) || `Sumsub request failed (${res.status})`;
            throw new ApiError(res.status === 404 ? 404 : 502, `Sumsub: ${message}`);
        }
        return json;
    }

    // Create (or fetch existing) applicant for a vendor. externalUserId ties the
    // Sumsub applicant back to our vendor profile.
    async createApplicant(externalUserId, { email, phone } = {}) {
        const path = `/resources/applicants?levelName=${encodeURIComponent(SUMSUB_VENDOR_LEVEL)}`;
        const body = {
            externalUserId: String(externalUserId),
            ...(email ? { email } : {}),
            ...(phone ? { phone } : {})
        };
        const result = await this._request('POST', path, body);
        return result; // contains { id, ... } where id is the applicantId
    }

    // Short-lived access token used by the Sumsub WebSDK on the client.
    async createAccessToken(externalUserId, ttlInSecs = 600) {
        const path = `/resources/accessTokens?userId=${encodeURIComponent(String(externalUserId))}`
            + `&levelName=${encodeURIComponent(SUMSUB_VENDOR_LEVEL)}&ttlInSecs=${ttlInSecs}`;
        // No request body — Sumsub rejects an empty {} here with "Unexpected body".
        const result = await this._request('POST', path);
        return result; // { token, userId }
    }

    // Verify the x-payload-digest header on an inbound webhook against the raw
    // request body. Returns true if valid (or if no secret is configured).
    verifyWebhookSignature(rawBody, signatureHeader, algoHeader = 'HMAC_SHA256_HEX') {
        if (!SUMSUB_WEBHOOK_SECRET) return true; // not enforced when unset
        if (!signatureHeader || !rawBody) return false;

        const algoMap = {
            HMAC_SHA1_HEX: 'sha1',
            HMAC_SHA256_HEX: 'sha256',
            HMAC_SHA512_HEX: 'sha512'
        };
        const algo = algoMap[algoHeader] || 'sha256';
        const expected = crypto
            .createHmac(algo, SUMSUB_WEBHOOK_SECRET)
            .update(rawBody)
            .digest('hex');

        try {
            return crypto.timingSafeEqual(
                Buffer.from(expected),
                Buffer.from(String(signatureHeader))
            );
        } catch (_) {
            return false;
        }
    }

    // Map a Sumsub review result/status to our vendor kyc_status enum.
    mapReviewToKycStatus(payload = {}) {
        const type = payload.type;
        const answer = payload.reviewResult && payload.reviewResult.reviewAnswer;

        if (type === 'applicantReviewed') {
            if (answer === 'GREEN') return 'approved';
            if (answer === 'RED') return 'rejected';
        }
        if (type === 'applicantPending' || type === 'applicantOnHold') return 'in_progress';
        if (type === 'applicantCreated') return 'in_progress';
        return null; // unknown / no status change
    }
}

module.exports = new SumsubService();
