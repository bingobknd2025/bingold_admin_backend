// models/news.model.js
module.exports = (sequelize, DataTypes) => {
    const News = sequelize.define('News', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'pda_users',
                key: 'id'
            }
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        short_description: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active',
            allowNull: false
        },
        dstatus: {
            type: DataTypes.ENUM('0', '1'),
            allowNull: false,
            defaultValue: '0'
        },
        category: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        meta_title: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        meta_description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        meta_keyword: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        cover_image: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        published_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'news',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return News;
};
