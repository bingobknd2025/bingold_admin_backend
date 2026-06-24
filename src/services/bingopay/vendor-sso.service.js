// services/bingopay/vendor-sso.service.js
//
// Partner/SSO-facing vendor flow. A partner app drives the whole vendor
// lifecycle through these operations (authed only by x-api-key), identifying
// vendors by the public `uuid` rather than the internal integer id:
//
//   QR handoff:   generateQr -> verifyToken -> getTokenStatus
//   Onboarding:   register (+login) / login / getVendorStatus
//   KYC/KYB:      submitKyc -> getKyc -> applyDecision
//
// It reuses the SAME tables as the admin vendor flow, so SSO-registered vendors
// show up in the existing admin list/review screens.
//
// EVERY operation (success AND failure) is recorded in `sso_sync_logs` via the
// _audit() wrapper, so the table is a full audit trail of the SSO surface.
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');
const db = require('../../models');
const { BingopayUser, VendorProfile, VendorKycDocument, VendorSsoToken, SsoSyncLog } = db;
const ApiError = require('../../utils/apiError.util');
const { hashPassword, comparePassword } = require('../../utils/hash.util');
const BingoldApi = require('./bingold-api.service');
const UserSync = require('./user-sync.service');
const PendingReg = require('./pending-registration.service');

const MERCHANT_CODE_PREFIX = 'MER';
const DEFAULT_TTL_SECONDS = 300;

// Map the SSO spec's UPPER_SNAKE document types onto the vendor_kyc_documents
// enum. Unknown types fall back to 'other'.
const KYC_DOC_ENUM = [
    'certificate_of_incorporation', 'gst_certificate', 'pan_card', 'director_id',
    'address_proof', 'bank_statement', 'selfie', 'other'
];

// Keys never written into the audit log (heavy or sensitive).
const LOG_REDACT = ['qr', 'accessToken', 'access_token', 'refreshToken', 'refresh_token',
    'token', 'bingoldToken', 'password', 'confirmPassword', 'password_hash', 'recaptchaToken'];

function mapDocumentType(raw) {
    if (!raw) return 'other';
    const lower = String(raw).trim().toLowerCase();
    return KYC_DOC_ENUM.includes(lower) ? lower : 'other';
}

function randomDigits(length = 7) {
    const bytes = crypto.randomBytes(length);
    let out = '';
    for (let i = 0; i < length; i++) out += (bytes[i] % 10).toString();
    return out;
}

async function generateMerchantCode() {
    for (let i = 0; i < 10; i++) {
        const code = MERCHANT_CODE_PREFIX + randomDigits(7);
        const exists = await VendorProfile.findOne({ where: { merchant_code: code } });
        if (!exists) return code;
    }
    throw new ApiError(500, 'Could not generate a unique merchant code');
}

// Build a compact, redacted snapshot of a value for the audit log: drops heavy
// (qr) + sensitive (token/password) fields and collapses arrays to a count.
function snapshot(value) {
    if (value === null || value === undefined) return null;
    if (Array.isArray(value)) return { count: value.length };
    if (typeof value !== 'object') return value;
    const out = {};
    for (const [k, v] of Object.entries(value)) {
        if (LOG_REDACT.includes(k)) continue;
        if (Array.isArray(v)) out[`${k}Count`] = v.length;
        else if (v && typeof v === 'object') out[k] = snapshot(v);
        else out[k] = v;
    }
    return out;
}

class VendorSsoService {
    // ─── audit wrapper ────────────────────────────────────────────
    // Runs `fn`, then records one sso_sync_logs row. The fn may set ctx.userId
    // (and ctx.bingoldUserId) once it has resolved the vendor/user so the log
    // links back to the right row; on failure we log whatever ctx has so far.
    async _audit(requestType, payload, fn) {
        const ctx = {};
        try {
            const result = await fn(ctx);
            await this._log(requestType, 'success', ctx, payload, snapshot(result));
            return result;
        } catch (err) {
            await this._log(requestType, 'failed', ctx, payload, {
                error: err.message,
                statusCode: err.statusCode || 500
            });
            throw err;
        }
    }

    async _log(requestType, status, ctx, payload, response) {
        try {
            await SsoSyncLog.create({
                bingopay_user_id: (ctx && ctx.userId) || null,
                bingold_user_id: (ctx && ctx.bingoldUserId) || null,
                request_type: requestType,
                request_payload: payload ? snapshot(payload) : null,
                response_payload: response || null,
                sync_status: status
            });
        } catch (_) { /* never let logging break the request */ }
    }

    // ─── helpers ──────────────────────────────────────────────────
    async resolveVendorByUuid(uuid, options = {}) {
        if (!uuid) throw new ApiError(400, 'vendor uuid is required');
        const vendor = await VendorProfile.findOne({ where: { uuid }, ...options });
        if (!vendor) throw new ApiError(404, 'Vendor not found');
        return vendor;
    }

    mintVendorToken(vendor, user) {
        return jwt.sign(
            {
                type: 'vendor',
                vendor_uuid: vendor.uuid,
                vendor_id: vendor.id,
                bingopay_user_id: user ? user.id : null,
                email: user ? user.email : null
            },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRY || '59m' }
        );
    }

    vendorSummary(vendor) {
        return {
            uuid: vendor.uuid,
            shopName: vendor.shop_name,
            shopSlug: vendor.shop_slug,
            businessName: vendor.business_name,
            merchantCode: vendor.merchant_code,
            status: vendor.status,
            kycStatus: vendor.kyc_status,
            kycMode: vendor.kyc_mode
        };
    }

    // Lazily flip a still-pending token to 'expired' once past its TTL.
    async lazyExpire(tokenRow) {
        if (tokenRow.status === 'pending' && tokenRow.expires_at && new Date(tokenRow.expires_at) < new Date()) {
            await tokenRow.update({ status: 'expired' });
        }
        return tokenRow;
    }

    // ─── 1. Generate SSO QR ───────────────────────────────────────
    async generateQr(uuid, { ttlSeconds, redirectUrl } = {}) {
        return this._audit('sso_qr', { uuid, ttlSeconds, redirectUrl }, async (ctx) => {
            const vendor = await this.resolveVendorByUuid(uuid);
            ctx.userId = vendor.user_id;

            const ttl = Number.isFinite(Number(ttlSeconds)) && Number(ttlSeconds) > 0
                ? Math.floor(Number(ttlSeconds)) : DEFAULT_TTL_SECONDS;
            const rawToken = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + ttl * 1000);

            await VendorSsoToken.create({
                vendor_id: vendor.id,
                token: rawToken,
                status: 'pending',
                redirect_url: redirectUrl || null,
                expires_at: expiresAt
            });

            // What the QR encodes: the partner's verify URL with the token
            // appended, or the bare token when no redirect was supplied.
            const qrPayload = redirectUrl
                ? `${redirectUrl}${redirectUrl.includes('?') ? '&' : '?'}token=${rawToken}`
                : rawToken;

            let qrDataUrl = null;
            try {
                const QRCode = require('qrcode');
                qrDataUrl = await QRCode.toDataURL(qrPayload);
            } catch (_) { /* image generation is best-effort */ }

            return {
                rawToken,
                token: rawToken,
                vendorUuid: vendor.uuid,
                qrPayload,
                qr: qrDataUrl,
                status: 'PENDING',
                ttlSeconds: ttl,
                redirectUrl: redirectUrl || null,
                expiresAt
            };
        });
    }

    // ─── 2. Verify scanned token ──────────────────────────────────
    async verifyToken({ token, scannedByUserUuid } = {}) {
        return this._audit('sso_verify', { tokenPresent: Boolean(token), scannedByUserUuid }, async (ctx) => {
            if (!token) throw new ApiError(400, 'token is required');

            const row = await VendorSsoToken.findOne({ where: { token } });
            if (!row) throw new ApiError(404, 'Token not found');

            await this.lazyExpire(row);
            if (row.status === 'expired') throw new ApiError(410, 'Token has expired');
            if (row.status === 'used') throw new ApiError(409, 'Token has already been used');

            await row.update({
                status: 'used',
                used_at: new Date(),
                scanned_by_user_uuid: scannedByUserUuid || null
            });

            const vendor = await VendorProfile.findByPk(row.vendor_id);
            if (vendor) ctx.userId = vendor.user_id;

            return {
                status: 'USED',
                verifiedAt: row.used_at,
                scannedByUserUuid: row.scanned_by_user_uuid,
                redirectUrl: row.redirect_url,
                vendor: vendor ? this.vendorSummary(vendor) : null
            };
        });
    }

    // ─── 3. Poll token status ─────────────────────────────────────
    async getTokenStatus(token) {
        return this._audit('sso_status', { tokenPresent: Boolean(token) }, async (ctx) => {
            if (!token) throw new ApiError(400, 'token is required');
            const row = await VendorSsoToken.findOne({ where: { token } });
            if (!row) throw new ApiError(404, 'Token not found');
            await this.lazyExpire(row);

            const vendor = await VendorProfile.findByPk(row.vendor_id, { attributes: ['uuid', 'user_id'] });
            if (vendor) ctx.userId = vendor.user_id;
            return {
                status: row.status.toUpperCase(),
                vendorUuid: vendor ? vendor.uuid : null,
                scannedByUserUuid: row.scanned_by_user_uuid,
                redirectUrl: row.redirect_url,
                expiresAt: row.expires_at,
                usedAt: row.used_at
            };
        });
    }

    // ─── 4. Register vendor (phase 1 of 2, OTP-gated) ─────────────
    // Validates + reserves nothing yet: it checks the email isn't already taken,
    // asks BinGold signup to send the OTP + welcome mail, and stashes the vendor
    // data (password encrypted) as a pending row. The BinGold identity and the
    // vendor_profiles/bingopay_users rows are created in verifyOtp() once the OTP
    // is confirmed — via register_user, which returns the shared uuid + token.
    async register(data = {}) {
        const { fullName, shopName, shopSlug, email, phone, password, countryId } = data;
        return this._audit('sso_register', { fullName, shopName, shopSlug, email, phone, countryId }, async () => {
            if (!fullName) throw new ApiError(400, 'fullName is required');
            if (!shopName) throw new ApiError(400, 'shopName is required');
            if (!shopSlug) throw new ApiError(400, 'shopSlug is required');
            if (!email) throw new ApiError(400, 'email is required');
            if (!phone) throw new ApiError(400, 'phone is required');
            if (!password) throw new ApiError(400, 'password is required');
            if (!countryId) throw new ApiError(400, 'countryId is required');

            const slug = slugify(String(shopSlug), { lower: true, strict: true });

            // Uniqueness pre-checks (DB unique indexes are the real guard at verify).
            if (await VendorProfile.findOne({ where: { shop_slug: slug } })) {
                throw new ApiError(409, 'shopSlug is already taken');
            }
            if (await BingopayUser.findOne({ where: { email } })) {
                throw new ApiError(409, 'A user with this email already exists');
            }
            // Reject emails that already have a BinGold account.
            let exists = false;
            try {
                const existsResp = await BingoldApi.userExists(email);
                const ed = existsResp && (existsResp.data ?? existsResp);
                exists = typeof ed === 'boolean' ? ed : Boolean(ed && (ed.exists ?? ed.userExists ?? ed.isExist ?? ed.status));
            } catch (_) { /* errored check is treated as "unknown" */ }
            if (exists) throw new ApiError(409, 'A user with this email already exists. Please login.');

            // BinGold signup requires confirmPassword; default to password unless
            // the client sent an explicit (mismatching) value.
            const confirmPassword = data.confirmPassword ?? password;
            if (confirmPassword !== password) {
                throw new ApiError(400, 'password and confirmPassword do not match');
            }

            const [firstName, ...rest] = String(fullName).trim().split(/\s+/);
            const lastName = rest.join(' ') || null;

            // Ask BinGold to send the OTP + welcome mail (no identity created yet).
            // signup does NOT accept userType (only register_user does, later at
            // verify-otp where we pass userType: 'VENDOR') — sending it here 400s.
            const upstream = await BingoldApi.signup({
                email,
                password,
                confirmPassword,
                firstName: firstName || fullName,
                lastName: lastName || firstName || fullName,
                countryId: String(countryId),
                phoneNumber: phone
            });

            // Stash everything verifyOtp() needs to finish onboarding.
            await PendingReg.save({
                email,
                accountType: 'vendor',
                password,
                firstName: firstName || fullName,
                lastName,
                phone,
                countryId,
                otpType: 'SIGNUP',
                payload: {
                    fullName,
                    shopName,
                    shopSlug: slug,
                    businessName: data.businessName || shopName,
                    description: data.description || null,
                    gstNumber: data.gstNumber || null,
                    panNumber: data.panNumber || null,
                    supportEmail: data.supportEmail || null,
                    supportPhone: data.supportPhone || null
                }
            });

            return {
                otpSent: true,
                email,
                message: 'OTP sent to your email. Verify it to complete vendor registration.',
                bingold: upstream
            };
        });
    }

    // ─── 4b. Verify OTP → finish vendor registration ──────────────
    // Confirms the OTP with BinGold, then (if a pending vendor registration
    // exists) creates the BinGold identity via register_user and mirrors it into
    // vendor_profiles + bingopay_users with the SAME uuid. Returns a vendor JWT.
    async verifyOtp(data = {}) {
        const { email, otp, type } = data;
        return this._audit('sso_verify_otp', { email }, async (ctx) => {
            if (!email) throw new ApiError(400, 'email is required');
            if (!otp) throw new ApiError(400, 'otp is required');

            const pending = await PendingReg.find(email);
            if (!pending || pending.accountType !== 'vendor') {
                throw new ApiError(404, 'No pending vendor registration found for this email');
            }

            // 1) Confirm the OTP with BinGold.
            const verifyResp = await BingoldApi.verifyOtp({
                email,
                otp,
                type: type || pending.otpType || 'SIGNUP'
            });

            // 2) Create the BinGold identity now that the email is verified.
            const identity = await UserSync.registerExternalIdentity({
                email: pending.email,
                password: pending.password,
                firstName: pending.firstName,
                lastName: pending.lastName,
                countryId: pending.countryId,
                phone: pending.phone,
                userType: 'VENDOR'
            });
            const bingoldUuid = identity.uuid;
            if (!bingoldUuid) throw new ApiError(502, 'BinGold did not return a user identity');

            const p = pending.payload || {};
            const password_hash = await hashPassword(String(pending.password));

            // 3) Mirror into the marketplace DB — same uuid on both rows.
            const { vendor, user } = await db.sequelize.transaction(async (t) => {
                const user = await BingopayUser.create({
                    uuid: bingoldUuid,
                    email: pending.email,
                    phone: pending.phone,
                    password_hash,
                    first_name: pending.firstName || null,
                    last_name: pending.lastName,
                    account_type: 'vendor',
                    status: 'active'
                }, { transaction: t });

                const merchant_code = await generateMerchantCode();

                const vendor = await VendorProfile.create({
                    user_id: user.id,
                    uuid: bingoldUuid,
                    business_name: p.businessName || p.shopName,
                    shop_name: p.shopName,
                    shop_slug: p.shopSlug,
                    description: p.description || null,
                    gst_number: p.gstNumber || null,
                    pan_number: p.panNumber || null,
                    support_email: p.supportEmail || null,
                    support_phone: p.supportPhone || null,
                    merchant_code,
                    kyc_status: 'pending',
                    status: 'pending'
                }, { transaction: t });

                return { vendor, user };
            });

            await PendingReg.remove(pending.email);
            ctx.userId = user.id;
            const accessToken = this.mintVendorToken(vendor, user);
            return {
                registered: true,
                vendor: this.vendorSummary(vendor),
                accessToken,
                tokenType: 'Bearer',
                bingoldToken: identity.token || null,
                bingold: verifyResp
            };
        });
    }

    // ─── 4c. Resend OTP (e.g. expired) ────────────────────────────
    async resendOtp(data = {}) {
        const { email, type } = data;
        return this._audit('sso_resend_otp', { email }, async () => {
            if (!email) throw new ApiError(400, 'email is required');
            const pending = await PendingReg.find(email);
            const otpType = type || (pending && pending.otpType) || 'SIGNUP';
            const resp = await BingoldApi.resendOtp({ email, type: otpType });
            return { otpSent: true, email, bingold: resp };
        });
    }

    // ─── 5. Vendor login ──────────────────────────────────────────
    // BinGold's external API has no login endpoint, so we authenticate against
    // the local password set at registration, then refresh status from BinGold's
    // get_profile (best-effort) and backfill the shared uuid if it's missing.
    async login({ identifier, password } = {}) {
        return this._audit('sso_login', { identifier }, async (ctx) => {
            if (!identifier) throw new ApiError(400, 'identifier is required');
            if (!password) throw new ApiError(400, 'password is required');

            const where = identifier.includes('@') ? { email: identifier } : { phone: identifier };
            // unscoped() so password_hash is selectable for the comparison.
            const user = await BingopayUser.unscoped().findOne({
                where: { ...where, account_type: 'vendor' }
            });
            if (!user || !user.password_hash) throw new ApiError(401, 'Invalid credentials');
            if (!await comparePassword(String(password), user.password_hash)) {
                throw new ApiError(401, 'Invalid credentials');
            }

            const vendor = await VendorProfile.findOne({ where: { user_id: user.id } });
            if (!vendor) throw new ApiError(404, 'No vendor profile for this user');
            ctx.userId = user.id;

            // Best-effort: pull fresh status + uuid from BinGold and backfill.
            let bingold = null;
            try {
                bingold = await BingoldApi.getExternalProfile(user.email);
                const p = (bingold && bingold.data && bingold.data.profile) || {};
                if (p.id && user.uuid !== String(p.id)) {
                    await user.update({ uuid: String(p.id) });
                    await vendor.update({ uuid: String(p.id) });
                }
            } catch (_) { /* profile refresh is best-effort */ }

            await user.update({ last_login_at: new Date() });
            const accessToken = this.mintVendorToken(vendor, user);
            return {
                vendor: this.vendorSummary(vendor),
                accessToken,
                tokenType: 'Bearer',
                bingoldProfile: bingold
            };
        });
    }

    // ─── 6. Check vendor status ───────────────────────────────────
    async getVendorStatus(identifier) {
        return this._audit('sso_vendor_status', { identifier }, async (ctx) => {
            if (!identifier) throw new ApiError(400, 'identifier is required');

            // identifier may be the vendor uuid OR the owner's email.
            let vendor = await VendorProfile.findOne({
                where: { uuid: identifier },
                include: [{ model: BingopayUser, as: 'user', attributes: ['id', 'email', 'phone', 'status'] }]
            });

            if (!vendor && identifier.includes('@')) {
                const user = await BingopayUser.findOne({ where: { email: identifier } });
                if (user) {
                    vendor = await VendorProfile.findOne({
                        where: { user_id: user.id },
                        include: [{ model: BingopayUser, as: 'user', attributes: ['id', 'email', 'phone', 'status'] }]
                    });
                }
            }

            if (!vendor) throw new ApiError(404, 'Vendor not found');
            ctx.userId = vendor.user_id;

            const email = vendor.user ? vendor.user.email : null;
            const phone = vendor.user ? vendor.user.phone : null;

            // View = fetch fresh BinGold profile and sync it into our DB so both
            // platforms show the same data (status, KYC, wallet addresses).
            let walletAddresses = this._asObject(vendor.wallet_addresses);
            let balances = null;
            let bigoldBalance = null;
            let profileSyncedAt = vendor.profile_synced_at || null;
            try {
                if (email) {
                    const synced = await UserSync.syncFromExternalProfile(email);
                    if (synced.vendor) vendor = synced.vendor;          // freshly-updated row
                    walletAddresses = synced.walletAddresses;
                    balances = synced.balances;
                    bigoldBalance = synced.bigoldBalance;
                    profileSyncedAt = synced.syncedAt;
                }
            } catch (_) { /* fall back to the cached local copy on any sync error */ }

            return {
                ...this.vendorSummary(vendor),
                email,
                phone,
                kycDecision: vendor.kyc_decision || null,
                walletAddresses,
                balances,
                bigoldBalance,
                profileSyncedAt
            };
        });
    }

    // ─── 6c. Vendor profile (full, synced from BinGold get_profile) ──
    async getProfile(uuid) {
        return this._audit('sso_vendor_profile', { uuid }, async (ctx) => {
            let vendor = await this.resolveVendorByUuid(uuid, {
                include: [{ model: BingopayUser, as: 'user', attributes: ['id', 'email', 'phone', 'status'] }]
            });
            ctx.userId = vendor.user_id;
            const email = vendor.user ? vendor.user.email : null;
            const phone = vendor.user ? vendor.user.phone : null;

            // Pull the live BinGold profile and sync it locally (best-effort).
            let synced = null;
            try { if (email) synced = await UserSync.syncFromExternalProfile(email); } catch (_) { /* fall back to cache */ }
            if (synced && synced.vendor) vendor = synced.vendor;

            return {
                vendor: {
                    ...this.vendorSummary(vendor),
                    email,
                    phone,
                    description: vendor.description || null,
                    gstNumber: vendor.gst_number || null,
                    panNumber: vendor.pan_number || null,
                    supportEmail: vendor.support_email || null,
                    supportPhone: vendor.support_phone || null,
                    kycDecision: vendor.kyc_decision || null
                },
                walletAddresses: synced ? synced.walletAddresses : this._asObject(vendor.wallet_addresses),
                balances: synced ? synced.balances : null,
                bigoldBalance: synced ? synced.bigoldBalance : null,
                usdtBalance: synced ? synced.usdtBalance : null,
                bingold: synced ? synced.raw : (this._asObject(vendor.bingold_profile) || null),
                profileSyncedAt: synced ? synced.syncedAt : (vendor.profile_synced_at || null)
            };
        });
    }

    // Normalize a coin label to the key used in BinGold balances[]. The settle
    // coin 'BIGOD' is held under the 'token' wallet.
    _coinKey(coin) {
        const c = String(coin || '').trim().toLowerCase();
        return c === 'bigod' ? 'token' : c;
    }

    // JSON columns can come back as a string on some MySQL/MariaDB setups
    // (Sequelize doesn't always auto-parse) — coerce to a plain object.
    _asObject(v) {
        if (!v) return {};
        if (typeof v === 'string') { try { return JSON.parse(v) || {}; } catch (_) { return {}; } }
        return v;
    }

    // ─── 6b. Receive QR (vendor's wallet address for a coin) ──────
    // Syncs the vendor's BinGold profile, picks the wallet address for the chosen
    // coin (defaults to the vendor's settle_coin), and returns a QR of it so a
    // customer can scan and pay into that address.
    async receiveQr(uuid, { coin, amount } = {}) {
        return this._audit('sso_receive_qr', { uuid, coin }, async (ctx) => {
            let vendor = await this.resolveVendorByUuid(uuid, {
                include: [{ model: BingopayUser, as: 'user', attributes: ['id', 'email'] }]
            });
            ctx.userId = vendor.user_id;

            // Refresh wallet addresses from BinGold (best-effort; fall back to cache).
            const email = vendor.user ? vendor.user.email : null;
            let syncedAt = vendor.profile_synced_at || null;
            try {
                if (email) {
                    const synced = await UserSync.syncFromExternalProfile(email);
                    if (synced.vendor) vendor = synced.vendor;
                    syncedAt = synced.syncedAt;
                }
            } catch (_) { /* use cached wallet_addresses */ }

            const requestedCoin = coin || vendor.settle_coin || 'BIGOD';
            const coinKey = this._coinKey(requestedCoin);
            const addresses = this._asObject(vendor.wallet_addresses);
            const address = addresses[coinKey];

            if (!address) {
                const available = Object.keys(addresses).filter((k) => addresses[k]);
                throw new ApiError(409,
                    `No BinGold wallet address for '${requestedCoin}' yet. Available: ${available.join(', ') || 'none'}`);
            }

            let qr = null;
            try {
                const QRCode = require('qrcode');
                qr = await QRCode.toDataURL(address);
            } catch (_) { /* image generation is best-effort */ }

            return {
                vendorUuid: vendor.uuid,
                coin: requestedCoin,
                coinKey,
                address,
                amount: amount || null,
                qr,
                profileSyncedAt: syncedAt
            };
        });
    }

    // ─── 7. Submit KYC/KYB documents ──────────────────────────────
    async submitKyc(uuid, { kybMode, documents } = {}) {
        return this._audit('sso_kyc_submit', { uuid, kybMode, documentCount: Array.isArray(documents) ? documents.length : 0 }, async (ctx) => {
            const vendor = await this.resolveVendorByUuid(uuid);
            ctx.userId = vendor.user_id;

            if (!Array.isArray(documents) || documents.length === 0) {
                throw new ApiError(400, 'At least one document is required');
            }
            for (const doc of documents) {
                if (!doc || !doc.documentUrl) throw new ApiError(400, 'Each document requires a documentUrl');
            }

            const mode = kybMode ? String(kybMode).toLowerCase() : null;
            if (mode && !['online', 'offline'].includes(mode)) {
                throw new ApiError(400, 'kybMode must be ONLINE or OFFLINE');
            }

            const saved = [];
            for (const doc of documents) {
                const document_type = mapDocumentType(doc.documentType);
                // One row per document_type per vendor: replace if it exists.
                const existing = await VendorKycDocument.findOne({
                    where: { vendor_id: vendor.id, document_type }
                });
                if (existing) {
                    await existing.update({
                        file_url: doc.documentUrl,
                        public_id: doc.publicId || null,
                        status: 'pending',
                        review_note: null
                    });
                    saved.push(existing);
                } else {
                    saved.push(await VendorKycDocument.create({
                        vendor_id: vendor.id,
                        document_type,
                        file_url: doc.documentUrl,
                        public_id: doc.publicId || null,
                        status: 'pending'
                    }));
                }
            }

            // Move into review without un-approving an already-approved vendor.
            const patch = {};
            if (mode) patch.kyc_mode = mode;
            if (vendor.kyc_status !== 'approved') patch.kyc_status = 'in_progress';
            await vendor.update(patch);

            return {
                vendorUuid: vendor.uuid,
                kycStatus: vendor.kyc_status,
                kybMode: vendor.kyc_mode,
                documents: saved
            };
        });
    }

    // ─── 8. Get KYC status + documents ────────────────────────────
    async getKyc(uuid) {
        return this._audit('sso_kyc_get', { uuid }, async (ctx) => {
            const vendor = await this.resolveVendorByUuid(uuid);
            ctx.userId = vendor.user_id;
            const documents = await VendorKycDocument.findAll({
                where: { vendor_id: vendor.id },
                order: [['created_at', 'DESC']]
            });
            return {
                vendorUuid: vendor.uuid,
                kycStatus: vendor.kyc_status,
                kybMode: vendor.kyc_mode,
                kycDecision: vendor.kyc_decision || null,
                documents
            };
        });
    }

    // ─── 9. KYC decision ──────────────────────────────────────────
    async applyDecision(uuid, { result, amlStatus, reasons, message, reviewedBy } = {}) {
        return this._audit('sso_kyc_decision', { uuid, result, amlStatus, reviewedBy }, async (ctx) => {
            const vendor = await this.resolveVendorByUuid(uuid);
            ctx.userId = vendor.user_id;

            const RESULTS = ['APPROVED', 'REJECTED', 'RECHECK'];
            const decision = String(result || '').toUpperCase();
            if (!RESULTS.includes(decision)) {
                throw new ApiError(400, `result must be one of: ${RESULTS.join(', ')}`);
            }

            const reasonList = Array.isArray(reasons) ? reasons : (reasons ? [reasons] : []);
            const kyc_decision = {
                result: decision,
                amlStatus: amlStatus || null,
                reasons: reasonList,
                message: message || null,
                reviewedBy: reviewedBy || null,
                decidedAt: new Date().toISOString()
            };

            const patch = { kyc_decision };
            if (decision === 'APPROVED') {
                patch.kyc_status = 'approved';
                patch.status = 'active';
                patch.rejection_reason = null;
                patch.approved_at = new Date();
            } else if (decision === 'REJECTED') {
                patch.kyc_status = 'rejected';
                patch.status = 'rejected';
                patch.rejection_reason = reasonList.join('; ') || null;
            } else { // RECHECK
                patch.kyc_status = 'in_progress';
                patch.rejection_reason = message || (reasonList.join('; ') || null);
            }

            await vendor.update(patch);

            // Mirror the KYC status onto the underlying user.
            if (vendor.user_id) {
                await BingopayUser.update({ kyc_status: patch.kyc_status }, { where: { id: vendor.user_id } });
            }

            return {
                vendorUuid: vendor.uuid,
                kycStatus: vendor.kyc_status,
                status: vendor.status,
                kycDecision: kyc_decision
            };
        });
    }
}

module.exports = new VendorSsoService();
