// models/temporary_investor_registration.model.js
//
// Captures BinGold investor (ICO) signups made on the investor-ui, which talks
// to an investor backend we do NOT own. That backend cannot be changed, so the
// two things it does not store are stored here instead:
//
//   1) account_type  — "individual" or "company", chosen on the signup form and
//                      deliberately stripped from the investor-ui signup payload.
//   2) documents     — company registration documents, uploaded on the extra
//                      step the investor-ui shows after OTP verification.
//
// Correlated with the investor backend by email only. NO credentials are ever
// stored here — the password never leaves the investor-ui → investor backend
// call. One row per email; re-signing-up before verification updates the row.
//
// Deliberately named "temporary_" — this is a capture/staging table, not the
// system of record for investor identity.
module.exports = (sequelize, DataTypes) => {
    const TemporaryInvestorRegistration = sequelize.define('TemporaryInvestorRegistration', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        account_type: {
            type: DataTypes.ENUM('individual', 'company'),
            allowNull: false,
            defaultValue: 'individual'
        },
        first_name: { type: DataTypes.STRING(100), allowNull: true },
        last_name: { type: DataTypes.STRING(100), allowNull: true },
        phone: { type: DataTypes.STRING(50), allowNull: true },
        // The investor-ui country select submits the country NAME, not an id.
        country: { type: DataTypes.STRING(100), allowNull: true },
        ref_code: { type: DataTypes.STRING(100), allowNull: true },
        // PENDING_OTP        → captured at signup, OTP not yet verified
        // PENDING_DOCUMENTS  → company, verified, documents still missing
        // DOCS_SUBMITTED     → company, documents uploaded, awaiting admin review
        // COMPLETED          → individual, verified (nothing further to collect)
        status: {
            type: DataTypes.ENUM('PENDING_OTP', 'PENDING_DOCUMENTS', 'DOCS_SUBMITTED', 'COMPLETED'),
            allowNull: false,
            defaultValue: 'PENDING_OTP'
        },
        // ── Company registration details ─────────────────────────────
        // Null for individuals; required (except where noted) for companies,
        // enforced in investor-registration.service.js rather than at the DB
        // level, since one table serves both account types.
        legal_company_name: { type: DataTypes.STRING(150), allowNull: true },
        // Optional — only supplied when it differs from the legal name.
        trading_name: { type: DataTypes.STRING(150), allowNull: true },
        legal_entity_type: { type: DataTypes.STRING(100), allowNull: true },
        country_of_incorporation: { type: DataTypes.STRING(100), allowNull: true },
        registration_number: { type: DataTypes.STRING(50), allowNull: true },
        tax_identification_number: { type: DataTypes.STRING(50), allowNull: true },
        date_of_incorporation: { type: DataTypes.DATEONLY, allowNull: true },
        industry: { type: DataTypes.STRING(150), allowNull: true },
        business_description: { type: DataTypes.TEXT, allowNull: true },
        // Optional.
        company_website: { type: DataTypes.STRING(200), allowNull: true },

        // ── Signup consents ──────────────────────────────────────────
        // Collected on the investor-ui signup form, which is the only place
        // they are given. The investor backend stores neither, so these columns
        // are the record of what each user agreed to.
        //
        // Timestamps are set by the investor-ui's server-side route handler,
        // never by the browser. The IP and the exact wording shown live in
        // meta.consent alongside them.

        // Terms & Conditions + Privacy Policy. Required to submit the form, so
        // in practice always true — stored anyway, because "we required it" is
        // not the same evidence as "this user ticked it at this moment".
        terms_accepted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        terms_accepted_at: { type: DataTypes.DATE, allowNull: true },

        // Marketing email opt-in. Optional and never pre-ticked, so false here
        // means the user left it alone — do not email them.
        marketing_opt_in: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        marketing_opt_in_at: { type: DataTypes.DATE, allowNull: true },

        // Wording version both consents were given under, so a later change to
        // the copy can be told apart from what earlier users agreed to.
        consent_version: { type: DataTypes.STRING(20), allowNull: true },

        // [{ doc_type, label, url, public_id, file_name, mime_type, size, uploaded_at }]
        documents: { type: DataTypes.JSON, allowNull: true },
        documents_submitted_at: { type: DataTypes.DATE, allowNull: true },
        // Which surface captured the row, so other front-ends can share the table.
        source: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'investor-ui' },
        // Diagnostics (user agent, captured_at...) plus meta.consent, which
        // carries the consent audit trail: { ip, version, text }.
        meta: { type: DataTypes.JSON, allowNull: true }
    }, {
        tableName: 'temporary_investor_registrations',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { fields: ['email'] },
            { fields: ['account_type'] },
            { fields: ['status'] },
            // Admins filter the list by opt-in to pull a mailing audience.
            { fields: ['marketing_opt_in'] }
        ]
    });

    return TemporaryInvestorRegistration;
};
