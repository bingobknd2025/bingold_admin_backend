// models/vendor_profile.model.js
//
// Business/merchant profile attached to a BingoPay user (account_type='vendor').
// KYC is run through Sumsub (sumsub_applicant_id) and approved by an admin
// (approved_by -> pda_users.id). No wallet/balance lives here — the vendor's
// merchant wallet is held in BinGold.
module.exports = (sequelize, DataTypes) => {
    const VendorProfile = sequelize.define('VendorProfile', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        user_id: {
            // -> bingopay_users.id
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },
        // Public, partner-facing identifier used by the SSO API surface. The
        // integer `id` stays internal; `uuid` is what partners pass in the path.
        uuid: {
            type: DataTypes.STRING(36),
            allowNull: true,
            unique: true
        },
        business_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        // Storefront identity collected during SSO self-registration.
        shop_name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        shop_slug: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true
        },
        business_type: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        registration_number: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        gst_number: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        pan_number: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        website: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        support_email: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        support_phone: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        annual_turnover: {
            type: DataTypes.DECIMAL(20, 2),
            allowNull: true
        },
        // Coin the merchant wants to be settled in (what they ultimately receive).
        settle_coin: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'BIGOD'
        },
        // Coins this merchant is willing to accept from payers. The payer may pay
        // in any of these directly; anything else is converted to settle_coin.
        accepted_coins: {
            type: DataTypes.JSON,
            allowNull: true // defaults applied in service: ['BIGOD']
        },
        merchant_code: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        sumsub_applicant_id: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        kyc_status: {
            type: DataTypes.ENUM('pending', 'in_progress', 'approved', 'rejected'),
            allowNull: false,
            defaultValue: 'pending'
        },
        // 'online' = Sumsub WebSDK; 'offline' = manual document upload + review.
        kyc_mode: {
            type: DataTypes.ENUM('online', 'offline'),
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('pending', 'active', 'suspended', 'rejected'),
            allowNull: false,
            defaultValue: 'pending'
        },
        approved_by: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
            references: { model: 'pda_users', key: 'id' }
        },
        approved_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        rejection_reason: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        // Latest KYC/KYB provider decision, as received from the SSO decision
        // callback: { result, amlStatus, reasons, message, reviewedBy, decidedAt }.
        kyc_decision: {
            type: DataTypes.JSON,
            allowNull: true
        },
        // coin -> wallet address map, cached from the vendor's BinGold profile
        // (balances[]). Used to render the receive-QR for the chosen settle coin.
        wallet_addresses: {
            type: DataTypes.JSON,
            allowNull: true
        },
        // Full last get_profile snapshot from BinGold.
        bingold_profile: {
            type: DataTypes.JSON,
            allowNull: true
        },
        profile_synced_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'vendor_profiles',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { fields: ['user_id'] },
            { unique: true, fields: ['merchant_code'] },
            { fields: ['kyc_status'] },
            { fields: ['status'] }
        ]
    });

    return VendorProfile;
};
