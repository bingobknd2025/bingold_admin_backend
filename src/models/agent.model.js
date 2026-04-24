// models/agent.model.js
module.exports = (sequelize, DataTypes) => {
    const Agent = sequelize.define('Agent', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        role: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        region: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        unique_code: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        qr_code: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        photo: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        expiry_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            allowNull: false,
            defaultValue: 'active'
        },
        created_by: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
            references: { model: 'pda_users', key: 'id' }
        },
        updated_by: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
            references: { model: 'pda_users', key: 'id' }
        }
    }, {
        tableName: 'agents',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Agent;
};
