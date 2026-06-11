// models/sso_sync_log.model.js
//
// Audit trail of every SSO interaction with BinGold (signup, login,
// user_exists check, profile/kyc updates, wallet creation). Used for
// debugging identity sync and for compliance.
module.exports = (sequelize, DataTypes) => {
    const SsoSyncLog = sequelize.define('SsoSyncLog', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        bingopay_user_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true
        },
        bingold_user_id: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        request_type: {
            // e.g. 'user_exists' | 'login' | 'signup' | 'profile_update' | 'kyc_update' | 'wallet_create'
            type: DataTypes.STRING(100),
            allowNull: false
        },
        request_payload: {
            type: DataTypes.JSON,
            allowNull: true
        },
        response_payload: {
            type: DataTypes.JSON,
            allowNull: true
        },
        sync_status: {
            type: DataTypes.ENUM('success', 'failed'),
            allowNull: false
        }
    }, {
        tableName: 'sso_sync_logs',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { fields: ['bingopay_user_id'] },
            { fields: ['bingold_user_id'] },
            { fields: ['request_type'] },
            { fields: ['sync_status'] }
        ]
    });

    return SsoSyncLog;
};
