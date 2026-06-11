module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        slug: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.TEXT
        },
        is_default: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        scope: {
            // 'admin' = back-office CMS roles (pda_users); 'bingopay' = payment
            // ecosystem roles (customers, vendors, cashiers). Existing roles
            // default to 'admin' so current behaviour is unchanged.
            type: DataTypes.ENUM('admin', 'bingopay'),
            allowNull: false,
            defaultValue: 'admin'
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'pda_roles',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true
    });

    return Role;
};