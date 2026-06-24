// services/bingopay/user-sync.service.js
//
// Single source of truth for writing a BingoPay user into our database. Every
// service that touches BinGold (auth, wallet, admin checks) calls upsertUser so
// the bingopay_users mapping table always reflects the latest known data.
// Matching is by bingold_user_id first, then email.
const db = require('../../models');
const { BingopayUser, VendorProfile } = db;
const BingoldApi = require('./bingold-api.service');

// Normalize BinGold's UPPER-case status/kyc onto our enums.
function mapStatus(s) {
    const k = String(s || '').toLowerCase();
    return ['active', 'blocked', 'suspended', 'pending'].includes(k) ? k : undefined;
}
function mapKyc(s) {
    const k = String(s || '').toLowerCase();
    if (['approved', 'completed', 'green'].includes(k)) return 'approved';
    if (['rejected', 'red'].includes(k)) return 'rejected';
    if (['in_progress', 'processing'].includes(k)) return 'in_progress';
    if (['pending', 'init'].includes(k)) return 'pending';
    return undefined;
}

// get_profile shapes vary across BinGold deployments: the profile may be under
// `data.profile` or directly under `data`, and names under `userDetail` or flat.
// This pulls the bits we cache into a normalized object.
function parseExternalProfile(resp) {
    const data = (resp && resp.data) || {};
    const p = data.profile || data;
    const detail = p.userDetail || p;
    const balances = Array.isArray(data.balances) ? data.balances
        : (Array.isArray(p.balances) ? p.balances : []);

    const walletAddresses = {};
    let tokenBalance = 0;
    for (const b of balances) {
        if (!b || !b.coin) continue;
        const coin = String(b.coin).toLowerCase();
        if (b.address) walletAddresses[coin] = b.address;
        // BIGOD is held under the 'token' coin (it has no on-chain address).
        if (coin === 'token') tokenBalance = Number(b.total_balance ?? b.balance ?? 0) || 0;
    }
    // BIGOD = the marketplace spending balance.
    const bigoldBalance = Number(data.bigoldBalance ?? p.bigoldBalance ?? tokenBalance) || 0;
    const usdtBalance = Number(data.usdtBalance ?? p.usdtBalance ?? 0) || 0;

    return {
        uuid: p.id ? String(p.id) : null,
        email: p.email || null,
        phone: p.phoneNumber || p.phone || null,
        first_name: detail.firstName || detail.first_name || null,
        last_name: detail.lastName || detail.last_name || null,
        status: mapStatus(p.status),
        kyc_status: mapKyc(p.kycStatus || p.kyc_status),
        walletAddresses,
        balances,
        bigoldBalance,
        usdtBalance,
        snapshot: data
    };
}

// Pull identity fields out of a BinGold /users/profile response (shape is
// undocumented, so we probe the common keys).
function extractProfile(resp) {
    const d = (resp && (resp.data ?? resp)) || {};
    const u = d.user || d.profile || d;
    return {
        bingold_user_id: u.id ?? u.userId ?? u.user_id ?? u._id ?? null,
        email: u.email || null,
        phone: u.phone || u.phoneNumber || null,
        first_name: u.firstName || u.first_name || null,
        last_name: u.lastName || u.last_name || null,
        kyc_status: u.kycStatus || u.kyc_status || null
    };
}

async function upsertUser(data = {}) {
    const { uuid, email, phone, first_name, last_name, bingold_user_id, password_hash, account_type, status, kyc_status, markLogin } = data;

    // Need at least one identifier to attach the record to.
    if (!uuid && !email && bingold_user_id == null) return null;

    // Match by the shared BinGold uuid first (most authoritative), then numeric
    // id, then email.
    let user = null;
    if (uuid) user = await BingopayUser.findOne({ where: { uuid } });
    if (!user && bingold_user_id != null) user = await BingopayUser.findOne({ where: { bingold_user_id } });
    if (!user && email) user = await BingopayUser.findOne({ where: { email } });

    const patch = {};
    if (uuid) patch.uuid = uuid;
    if (bingold_user_id != null) patch.bingold_user_id = bingold_user_id;
    if (email) patch.email = email;
    if (phone) patch.phone = phone;
    if (first_name) patch.first_name = first_name;
    if (last_name) patch.last_name = last_name;
    if (password_hash) patch.password_hash = password_hash;
    if (account_type) patch.account_type = account_type;
    if (status) patch.status = status;
    if (kyc_status) patch.kyc_status = kyc_status;
    if (markLogin) patch.last_login_at = new Date();

    if (user) return user.update(patch);

    return BingopayUser.create({
        uuid: uuid || null,
        email: email || null,
        phone: phone || null,
        first_name: first_name || null,
        last_name: last_name || null,
        bingold_user_id: bingold_user_id != null ? bingold_user_id : null,
        password_hash: password_hash || null,
        account_type: account_type || 'customer',
        status: status || 'pending',
        ...(kyc_status ? { kyc_status } : {}),
        ...(markLogin ? { last_login_at: new Date() } : {})
    });
}

// Provision the BinGold identity via the external register_user API and return
// the shared uuid + session token. Used after OTP verification (the OTP step
// only validated the email; register_user is what actually creates the identity).
// If register_user reports the user already exists, fall back to get_profile to
// recover the uuid so onboarding can still complete.
async function registerExternalIdentity({ email, password, firstName, lastName, countryId, phone, userType = 'USER' }) {
    let raw;
    try {
        raw = await BingoldApi.registerExternalUser({
            email,
            password,
            firstName: firstName || email,
            lastName: lastName || firstName || email,
            countryId: countryId != null ? String(countryId) : undefined,
            phoneNumber: phone,
            userType
        });
        const d = (raw && raw.data) || {};
        return { uuid: d.id != null ? String(d.id) : null, token: d.token || null, raw };
    } catch (err) {
        const msg = String(err && err.message || '').toLowerCase();
        const alreadyExists = (err && err.statusCode === 409) || msg.includes('already') || msg.includes('exist');
        if (!alreadyExists) throw err;
        // Identity already present (e.g. created by the signup step) — recover uuid.
        const profile = await BingoldApi.getExternalProfile(email);
        const p = (profile && profile.data && (profile.data.profile || profile.data)) || {};
        return { uuid: p.id != null ? String(p.id) : null, token: p.token || null, raw: profile };
    }
}

// Resolve the caller's BinGold identity from their session token and upsert the
// local bingopay_users row. Returns { user, info } where user is the local row.
async function resolveFromToken(token, extra = {}) {
    const profileResp = await BingoldApi.getProfile(token);
    const info = extractProfile(profileResp);
    if (!info.email && info.bingold_user_id == null) {
        const err = new Error('Could not resolve BinGold identity from token');
        err.statusCode = 401;
        throw err;
    }
    const normalizedKyc = (() => {
        const k = (info.kyc_status || '').toString().toLowerCase();
        if (['approved', 'completed', 'green'].includes(k)) return 'approved';
        if (['rejected', 'red'].includes(k)) return 'rejected';
        if (['pending', 'init'].includes(k)) return 'pending';
        return undefined;
    })();
    const user = await upsertUser({
        email: info.email,
        phone: info.phone,
        first_name: info.first_name,
        last_name: info.last_name,
        bingold_user_id: info.bingold_user_id,
        ...(normalizedKyc ? { kyc_status: normalizedKyc } : {}),
        ...extra
    });
    return { user, info, raw: profileResp };
}

// Fetch the live BinGold profile for `email`, cache it locally, and return the
// merged view. Called whenever an admin/partner VIEWS or EDITS a user/vendor so
// both platforms show the same data. Updates the bingopay_users row and, if the
// user is a vendor, the vendor_profiles row too (same wallet_addresses snapshot).
async function syncFromExternalProfile(email) {
    if (!email) {
        const err = new Error('email is required to sync profile');
        err.statusCode = 400;
        throw err;
    }

    const resp = await BingoldApi.getExternalProfile(email);
    const info = parseExternalProfile(resp);
    const now = new Date();

    // Locate the local user (by shared uuid first, then email).
    let user = null;
    if (info.uuid) user = await BingopayUser.findOne({ where: { uuid: info.uuid } });
    if (!user) user = await BingopayUser.findOne({ where: { email } });

    const userPatch = {
        ...(info.uuid ? { uuid: info.uuid } : {}),
        ...(info.phone ? { phone: info.phone } : {}),
        ...(info.first_name ? { first_name: info.first_name } : {}),
        ...(info.last_name ? { last_name: info.last_name } : {}),
        ...(info.status ? { status: info.status } : {}),
        ...(info.kyc_status ? { kyc_status: info.kyc_status } : {}),
        wallet_addresses: info.walletAddresses,
        bingold_profile: info.snapshot,
        profile_synced_at: now
    };

    if (user) {
        await user.update(userPatch);
    } else {
        user = await BingopayUser.create({
            email, account_type: 'customer', status: info.status || 'active', ...userPatch
        });
    }

    // Mirror onto the vendor profile (if this user is a vendor).
    let vendor = await VendorProfile.findOne({ where: { user_id: user.id } });
    if (vendor) {
        await vendor.update({
            ...(info.uuid && vendor.uuid !== info.uuid ? { uuid: info.uuid } : {}),
            wallet_addresses: info.walletAddresses,
            bingold_profile: info.snapshot,
            profile_synced_at: now
        });
    }

    return {
        user,
        vendor,
        walletAddresses: info.walletAddresses,
        balances: info.balances,
        bigoldBalance: info.bigoldBalance,
        usdtBalance: info.usdtBalance,
        syncedAt: now,
        raw: resp
    };
}

module.exports = { upsertUser, resolveFromToken, extractProfile, parseExternalProfile, syncFromExternalProfile, registerExternalIdentity };
