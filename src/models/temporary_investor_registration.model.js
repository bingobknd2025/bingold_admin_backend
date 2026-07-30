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

        // [{ doc_type, label, url, public_id, file_name, mime_type, size, uploaded_at }]
        documents: { type: DataTypes.JSON, allowNull: true },
        documents_submitted_at: { type: DataTypes.DATE, allowNull: true },
        // Which surface captured the row, so other front-ends can share the table.
        source: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'investor-ui' },
        // Diagnostics only (user agent, captured_at, signup response flags...).
        meta: { type: DataTypes.JSON, allowNull: true }
    }, {
        tableName: 'temporary_investor_registrations',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { fields: ['email'] },
            { fields: ['account_type'] },
            { fields: ['status'] }
        ]
    });

    return TemporaryInvestorRegistration;
};
