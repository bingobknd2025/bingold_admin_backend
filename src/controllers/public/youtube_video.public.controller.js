// controllers/public/youtube_video.public.controller.js
const db = require('../../models');
const { YoutubeVideo } = db;
const ApiError = require('../../utils/apiError.util');

const ALLOWED_PLATFORMS = ['web', 'app', 'bingold', 'all'];

class PublicYoutubeVideoController {

    async listVideos(req, res, next) {
        try {
            const page = parseInt(req.body.page || req.query.page, 10) || 1;
            const limit = parseInt(req.body.limit || req.query.limit, 10) || 10;
            const offset = (page - 1) * limit;

            const platform = req.body.platform || req.query.platform;

            const where = { status: 'active' };

            if (platform) {
                if (!ALLOWED_PLATFORMS.includes(platform)) {
                    throw new ApiError(400, `platform must be one of: ${ALLOWED_PLATFORMS.join(', ')}`);
                }
                // include videos targeted to this platform OR to "all"
                where.platform = { [db.Sequelize.Op.in]: [platform, 'all'] };
            }

            const { count, rows } = await YoutubeVideo.findAndCountAll({
                where,
                attributes: [
                    'id',
                    'title',
                    'video_url',
                    'platform',
                    'status',
                    'created_at',
                    'updated_at'
                ],
                limit,
                offset,
                order: [['created_at', 'DESC']]
            });

            res.json({
                success: true,
                message: 'Youtube videos retrieved successfully',
                data: {
                    totalRecords: count,
                    totalPages: Math.ceil(count / limit),
                    page,
                    limit,
                    result: rows
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getVideoById(req, res, next) {
        try {
            const id = req.params.id || req.body.id;

            if (!id) {
                throw new ApiError(400, 'Youtube video id is required');
            }

            const video = await YoutubeVideo.findOne({
                where: { id, status: 'active' },
                attributes: [
                    'id',
                    'title',
                    'video_url',
                    'platform',
                    'status',
                    'created_at',
                    'updated_at'
                ]
            });

            if (!video) {
                throw new ApiError(404, 'Youtube video not found');
            }

            res.json({
                success: true,
                message: 'Youtube video fetched successfully',
                data: video
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PublicYoutubeVideoController();
