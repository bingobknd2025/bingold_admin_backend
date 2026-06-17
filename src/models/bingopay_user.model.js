// models/bingopay_user.model.js
//
// BingoPay end-user (customer / vendor). This is intentionally a *mapping* row
// onto the BinGold identity system (bingold_user_id) — BinGold remains the
// system of record for identity, wallet, balance, ledger and settlement.
// Admin (pda_users) accounts are deliberately kept separate from these rows.
module.exports = (sequelize, DataTypes) => {
    const BingopayUser = sequelize.define('BingopayUser', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        // Shared identity UUID issued by BinGold at registration — the SAME value
        // is stored on vendor_profiles.uuid, so the vendor has one identity across
        // both platforms. Nullable for legacy/customer rows that predate SSO.
        uuid: {
            type: DataTypes.STRING(36),
            allowNull: true,
            unique: true
        },
        bingold_user_id: {
            // Identity in the BinGold system (source of truth). Nullable until SSO sync completes.
            type: DataTypes.BIGINT,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        // bcrypt hash for vendor self-service login (SSO register/login). NULL for
        // users that never set a password. Excluded from queries by default scope.
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        first_name: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        last_name: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        account_type: {
            type: DataTypes.ENUM('customer', 'vendor', 'merchant_staff'),
            allowNull: false,
            defaultValue: 'customer'
        },
        status: {
            type: DataTypes.ENUM('pending', 'active', 'blocked', 'suspended'),
            allowNull: false,
            defaultValue: 'pending'
        },
        email_verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        phone_verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        kyc_status: {
            type: DataTypes.ENUM('pending', 'in_progress', 'approved', 'rejected'),
            allowNull: false,
            defaultValue: 'pending'
        },
        last_login_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'bingopay_users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        // Never leak the password hash; use .unscoped() when it's needed (login).
        defaultScope: { attributes: { exclude: ['password_hash'] } },
        indexes: [
            { fields: ['bingold_user_id'] },
            { fields: ['email'] },
            { fields: ['account_type'] },
            { fields: ['status'] }
        ]
    });

    return BingopayUser;
};
