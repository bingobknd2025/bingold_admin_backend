// models/vendor_sso_token.model.js
//
// Short-lived token backing the vendor SSO QR handoff. A partner app asks for a
// QR (which embeds a rawToken), the token is scanned + verified, then polled for
// status. Lifecycle: pending -> used (on verify) | expired (past expires_at).
module.exports = (sequelize, DataTypes) => {
    const VendorSsoToken = sequelize.define('VendorSsoToken', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        vendor_id: {
            // -> vendor_profiles.id
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING(128),
            allowNull: false,
            unique: true
        },
        status: {
            type: DataTypes.ENUM('pending', 'used', 'expired'),
            allowNull: false,
            defaultValue: 'pending'
        },
        redirect_url: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        scanned_by_user_uuid: {
            type: DataTypes.STRING(36),
            allowNull: true
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        used_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'vendor_sso_tokens',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { unique: true, fields: ['token'] },
            { fields: ['vendor_id'] },
            { fields: ['status'] }
        ]
    });

    return VendorSsoToken;
};
