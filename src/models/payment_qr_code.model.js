// models/payment_qr_code.model.js
//
// Merchant *payment* QR code. Deliberately separate from the field-agent QR
// system (agents.qr_code) so payment flows never mix with agent verification.
// Static = fixed/open amount printed once; dynamic = generated per-charge.
module.exports = (sequelize, DataTypes) => {
    const PaymentQrCode = sequelize.define('PaymentQrCode', {
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
        qr_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        label: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        qr_type: {
            type: DataTypes.ENUM('static', 'dynamic'),
            allowNull: false,
            defaultValue: 'static'
        },
        amount: {
            // Fixed amount for static/dynamic charge QR. NULL = open amount.
            type: DataTypes.DECIMAL(30, 8),
            allowNull: true
        },
        coin: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'BIGOD'
        },
        qr_image: {
            // Cloudinary URL of the rendered QR PNG.
            type: DataTypes.STRING(255),
            allowNull: true
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        created_by: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
            references: { model: 'pda_users', key: 'id' }
        }
    }, {
        tableName: 'payment_qr_codes',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { fields: ['vendor_id'] },
            { unique: true, fields: ['qr_uuid'] },
            { fields: ['status'] }
        ]
    });

    return PaymentQrCode;
};
