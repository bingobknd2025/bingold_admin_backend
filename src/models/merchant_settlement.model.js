// models/merchant_settlement.model.js
//
// Payout batch for a vendor. Settlement money movement is performed by the
// existing BinGold withdrawal flow (POST /transaction/withdraw_request,
// admin-approved). We store bingold_withdraw_reference to link to it.
module.exports = (sequelize, DataTypes) => {
    const MerchantSettlement = sequelize.define('MerchantSettlement', {
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
        settlement_reference: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        total_amount: {
            type: DataTypes.DECIMAL(30, 8),
            allowNull: false
        },
        coin: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'BIGOD'
        },
        settlement_status: {
            type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
            allowNull: false,
            defaultValue: 'pending'
        },
        bingold_withdraw_reference: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        processed_by: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
            references: { model: 'pda_users', key: 'id' }
        },
        processed_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        note: {
            type: DataTypes.STRING(500),
            allowNull: true
        }
    }, {
        tableName: 'merchant_settlements',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { fields: ['vendor_id'] },
            { unique: true, fields: ['settlement_reference'] },
            { fields: ['settlement_status'] }
        ]
    });

    return MerchantSettlement;
};
