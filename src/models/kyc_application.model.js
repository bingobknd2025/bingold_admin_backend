// models/kyc_application.model.js
//
// One KYC attempt against a provider (Sumsub today). Records the applicant id,
// latest review status/result and the raw webhook payload for audit. Attached
// to a BingoPay user and/or a vendor profile.
module.exports = (sequelize, DataTypes) => {
    const KycApplication = sequelize.define('KycApplication', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        user_id: {
            // -> bingopay_users.id
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true
        },
        vendor_id: {
            // -> vendor_profiles.id
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true
        },
        provider: {
            type: DataTypes.ENUM('sumsub'),
            allowNull: false,
            defaultValue: 'sumsub'
        },
        applicant_id: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        review_status: {
            // raw provider status e.g. init / pending / completed
            type: DataTypes.STRING(50),
            allowNull: true
        },
        review_result: {
            // normalized result e.g. GREEN / RED + reject labels
            type: DataTypes.JSON,
            allowNull: true
        },
        webhook_payload: {
            type: DataTypes.JSON,
            allowNull: true
        }
    }, {
        tableName: 'kyc_applications',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { fields: ['user_id'] },
            { fields: ['vendor_id'] },
            { fields: ['applicant_id'] }
        ]
    });

    return KycApplication;
};
