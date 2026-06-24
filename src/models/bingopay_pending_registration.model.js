// models/bingopay_pending_registration.model.js
//
// Holds an in-flight registration between the two onboarding phases:
//   1) register  -> BinGold signup sends OTP + welcome mail; we stash the
//                   submitted data here (password encrypted at rest).
//   2) verify-otp -> on success we forward this data to BinGold register_user
//                   (which creates the identity), mirror it locally, and DELETE
//                   this row.
// One pending row per email; re-registering before verification replaces it.
module.exports = (sequelize, DataTypes) => {
    const BingopayPendingRegistration = sequelize.define('BingopayPendingRegistration', {
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
            type: DataTypes.ENUM('customer', 'vendor'),
            allowNull: false,
            defaultValue: 'customer'
        },
        first_name: { type: DataTypes.STRING(100), allowNull: true },
        last_name: { type: DataTypes.STRING(100), allowNull: true },
        phone: { type: DataTypes.STRING(50), allowNull: true },
        country_id: { type: DataTypes.STRING(10), allowNull: true },
        // AES-256-GCM ciphertext of the plaintext password (utils/crypto.util).
        password_enc: { type: DataTypes.TEXT, allowNull: false },
        // The OTP `type` used at signup, replayed on resend/verify (e.g. SIGNUP).
        otp_type: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'SIGNUP' },
        // Extra fields needed to finish onboarding (vendor: shop/business/kyc ids).
        payload: { type: DataTypes.JSON, allowNull: true },
        expires_at: { type: DataTypes.DATE, allowNull: true }
    }, {
        tableName: 'bingopay_pending_registrations',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        // password_enc is sensitive — exclude from default queries.
        defaultScope: { attributes: { exclude: ['password_enc'] } },
        indexes: [
            { fields: ['email'] },
            { fields: ['account_type'] }
        ]
    });

    return BingopayPendingRegistration;
};
