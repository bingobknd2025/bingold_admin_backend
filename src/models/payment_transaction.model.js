// models/payment_transaction.model.js
//
// Orchestration record for a customer -> merchant payment. The actual money
// movement happens in BinGold (via its internal wallet-transfer API); we store
// the returned bingold_transaction_id / hash as the link to the source of
// truth. We never hold balances or a ledger here.
module.exports = (sequelize, DataTypes) => {
    const PaymentTransaction = sequelize.define('PaymentTransaction', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        payment_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        qr_id: {
            // -> payment_qr_codes.id (nullable: direct/P2M without a stored QR)
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true
        },
        sender_user_id: {
            // -> bingopay_users.id (nullable until the payer is mapped locally)
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true
        },
        sender_bingold_user_id: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        receiver_vendor_id: {
            // -> vendor_profiles.id
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },
        // Settlement leg — what the MERCHANT receives.
        amount: {
            type: DataTypes.DECIMAL(30, 8),
            allowNull: false
        },
        coin: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'BIGOD'
        },
        // Payment leg — what the CUSTOMER actually paid with (may differ from the
        // settle coin when a conversion happened, e.g. pay USDT -> merchant gets BIGOD).
        pay_coin: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        pay_amount: {
            type: DataTypes.DECIMAL(30, 8),
            allowNull: true
        },
        conversion_rate: {
            // settle_coin per 1 pay_coin (or pay_coin per settle_coin — stored as used).
            type: DataTypes.DECIMAL(30, 12),
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('initiated', 'processing', 'success', 'failed', 'reversed'),
            allowNull: false,
            defaultValue: 'initiated'
        },
        bingold_transaction_id: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        blockchain_tx_hash: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        failure_reason: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        note: {
            type: DataTypes.STRING(500),
            allowNull: true
        }
    }, {
        tableName: 'payment_transactions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { unique: true, fields: ['payment_uuid'] },
            { fields: ['receiver_vendor_id'] },
            { fields: ['sender_user_id'] },
            { fields: ['status'] },
            { fields: ['created_at'] }
        ]
    });

    return PaymentTransaction;
};
