// services/youtube_video.service.js
const db = require('../models');
const { YoutubeVideo, PdaUser } = db;
const ApiError = require('../utils/apiError.util');

class YoutubeVideoService {
    async createVideo(data, userId) {
        const video = await YoutubeVideo.create({
            title: data.title,
            video_url: data.video_url,
            platform: data.platform || 'web',
            status: data.status || 'active',
            created_by: userId,
            updated_by: userId
        });

        return video;
    }

    async getVideoById(id) {
        const video = await YoutubeVideo.findByPk(id, {
            include: [
                { model: PdaUser, as: 'creator', attributes: ['id', 'name', 'email'] },
                { model: PdaUser, as: 'updater', attributes: ['id', 'name', 'email'] }
            ]
        });

        if (!video) {
            throw new ApiError(404, 'Youtube video not found');
        }

        return video;
    }

    async getVideoList(page = 1, limit = 10, filters = {}) {
        const offset = (page - 1) * limit;
        const where = {};

        if (filters.search) {
            where.title = { [db.Sequelize.Op.like]: `%${filters.search}%` };
        }

        if (filters.platform) {
            where.platform = filters.platform;
        }

        if (filters.status) {
            where.status = filters.status;
        }

        const { count, rows } = await YoutubeVideo.findAndCountAll({
            where,
            include: [
                { model: PdaUser, as: 'creator', attributes: ['id', 'name', 'email'] },
                { model: PdaUser, as: 'updater', attributes: ['id', 'name', 'email'] }
            ],
            limit,
            offset,
            order: [['created_at', 'DESC']]
        });

        return {
            total: count,
            page,
            totalPages: Math.ceil(count / limit),
            data: rows
        };
    }

    async updateVideo(id, data, userId) {
        const video = await this.getVideoById(id);

        delete data.id;
        delete data.created_by;
        delete data.created_at;
        delete data.updated_at;

        data.updated_by = userId;

        return video.update(data);
    }

    async deleteVideo(id) {
        const video = await this.getVideoById(id);
        await video.destroy();
        return { success: true, message: 'Youtube video deleted successfully' };
    }
}

module.exports = new YoutubeVideoService();
