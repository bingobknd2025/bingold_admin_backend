// models/youtube_video.model.js
module.exports = (sequelize, DataTypes) => {
    const YoutubeVideo = sequelize.define('YoutubeVideo', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        video_url: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        platform: {
            type: DataTypes.ENUM('web', 'app', 'bingold', 'all'),
            allowNull: false,
            defaultValue: 'web'
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            allowNull: false,
            defaultValue: 'active'
        },
        created_by: {
            type: DataTypes.BIGINT.UNSIGNED,  // ← was INTEGER.UNSIGNED
            allowNull: true,
            references: {
                model: 'pda_users',
                key: 'id'
            }
        },
        updated_by: {
            type: DataTypes.BIGINT.UNSIGNED,  // ← was INTEGER.UNSIGNED
            allowNull: true,
            references: {
                model: 'pda_users',
                key: 'id'
            }
        }
    }, {
        tableName: 'youtube_videos',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return YoutubeVideo;
};
