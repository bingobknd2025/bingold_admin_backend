// services/bingopay/pending-registration.service.js
//
// Stash + retrieve an in-flight registration between the OTP-send (register) and
// OTP-verify phases. Shared by the customer (customer.service) and vendor
// (vendor-sso.service) onboarding flows so both persist/consume the same way.
//
// The plaintext password is needed at verify time to call BinGold register_user,
// so it is encrypted at rest here (utils/crypto.util) and decrypted only when
// the row is consumed; the row is deleted as soon as onboarding completes.
const db = require('../../models');
const { BingopayPendingRegistration } = db;
const { encrypt, decrypt } = require('../../utils/crypto.util');

class PendingRegistrationService {
    // Upsert one pending row per email (a re-register before verification
    // replaces the previous attempt). `data.password` is plaintext and is
    // encrypted before storage. `data.payload` holds flow-specific extras.
    async save({ email, accountType, password, firstName, lastName, phone, countryId, otpType = 'SIGNUP', payload = null, ttlSeconds = 1800 }) {
        const values = {
            email,
            account_type: accountType || 'customer',
            password_enc: encrypt(password),
            first_name: firstName || null,
            last_name: lastName || null,
            phone: phone || null,
            country_id: countryId != null ? String(countryId) : null,
            otp_type: otpType || 'SIGNUP',
            payload: payload || null,
            expires_at: ttlSeconds ? new Date(Date.now() + ttlSeconds * 1000) : null
        };

        const existing = await BingopayPendingRegistration.findOne({ where: { email } });
        if (existing) return existing.update(values);
        return BingopayPendingRegistration.create(values);
    }

    // Fetch a pending row WITH the password decrypted. Returns null if none.
    async find(email) {
        if (!email) return null;
        const row = await BingopayPendingRegistration.unscoped().findOne({ where: { email } });
        if (!row) return null;
        let password = null;
        try { password = decrypt(row.password_enc); } catch (_) { /* corrupt/rotated key */ }
        return {
            row,
            email: row.email,
            accountType: row.account_type,
            password,
            firstName: row.first_name,
            lastName: row.last_name,
            phone: row.phone,
            countryId: row.country_id,
            otpType: row.otp_type,
            payload: row.payload || {},
            expiresAt: row.expires_at
        };
    }

    async remove(email) {
        if (!email) return 0;
        return BingopayPendingRegistration.destroy({ where: { email } });
    }
}

module.exports = new PendingRegistrationService();
