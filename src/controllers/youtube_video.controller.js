// controllers/youtube_video.controller.js
const YoutubeVideoService = require('../services/youtube_video.service');
const ApiError = require('../utils/apiError.util');

const ALLOWED_PLATFORMS = ['web', 'app', 'bingold', 'all'];
const ALLOWED_STATUSES = ['active', 'inactive'];

class YoutubeVideoController {
    async createVideo(req, res, next) {
        try {
            if (!req.user || !req.user.pda_user_id) {
                throw new ApiError(401, 'Unauthorized');
            }

            const { title, video_url, platform, status } = req.body;

            if (!title || !video_url) {
                throw new ApiError(400, 'title and video_url are required');
            }

            if (platform && !ALLOWED_PLATFORMS.includes(platform)) {
                throw new ApiError(400, `platform must be one of: ${ALLOWED_PLATFORMS.join(', ')}`);
            }

            if (status && !ALLOWED_STATUSES.includes(status)) {
                throw new ApiError(400, `status must be one of: ${ALLOWED_STATUSES.join(', ')}`);
            }

            const video = await YoutubeVideoService.createVideo(req.body, req.user.pda_user_id);

            res.status(201).json({
                success: true,
                message: 'Youtube video created successfully',
                data: video
            });
        } catch (error) {
            next(error);
        }
    }

    async getVideoList(req, res, next) {
        try {
            const { page, limit, ...filters } = req.body;
            const result = await YoutubeVideoService.getVideoList(
                parseInt(page, 10) || 1,
                parseInt(limit, 10) || 10,
                filters
            );
            res.json({
                success: true,
                message: 'Youtube videos retrieved successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getVideo(req, res, next) {
        try {
            const { id } = req.body;
            if (!id) {
                throw new ApiError(400, 'Youtube video id is required');
            }
            const video = await YoutubeVideoService.getVideoById(id);
            res.json({
                success: true,
                message: 'Youtube video fetched successfully',
                data: video
            });
        } catch (error) {
            next(error);
        }
    }

    async updateVideo(req, res, next) {
        try {
            if (!req.user || !req.user.pda_user_id) {
                throw new ApiError(401, 'Unauthorized');
            }

            const { id, platform, status } = req.body;
            if (!id) {
                throw new ApiError(400, 'Youtube video id is required');
            }

            if (platform && !ALLOWED_PLATFORMS.includes(platform)) {
                throw new ApiError(400, `platform must be one of: ${ALLOWED_PLATFORMS.join(', ')}`);
            }

            if (status && !ALLOWED_STATUSES.includes(status)) {
                throw new ApiError(400, `status must be one of: ${ALLOWED_STATUSES.join(', ')}`);
            }

            const video = await YoutubeVideoService.updateVideo(id, req.body, req.user.pda_user_id);
            res.json({
                success: true,
                message: 'Youtube video updated successfully',
                data: video
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteVideo(req, res, next) {
        try {
            const { id } = req.body;
            if (!id) {
                throw new ApiError(400, 'Youtube video id is required');
            }
            const result = await YoutubeVideoService.deleteVideo(id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new YoutubeVideoController();
