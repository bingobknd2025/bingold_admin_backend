// controllers/news.controller.js
const NewsService = require('../services/news.service');
const ApiError = require('../utils/apiError.util');
const cloudinaryHelper = require('../utils/cloudinaryHelper.util');

class NewsController {
    async createNews(req, res, next) {
        try {
            if (!req.user || !req.user.pda_user_id) {
                throw new ApiError(401, 'Unauthorized');
            }

            const {
                title,
                slug,
                short_description,
                description,
                status,
                category,
                meta_title,
                meta_description,
                meta_keyword,
                cover_image,
                image,
                published_at
            } = req.body;

            // Process file uploads if they exist
            if (req.files) {
                if (req.files.cover_image && req.files.cover_image[0]) {
                    const result = await cloudinaryHelper.uploadBuffer(req.files.cover_image[0].buffer, 'bingold/news/cover');
                    req.body.cover_image = result.secure_url;
                }
                if (req.files.image && req.files.image[0]) {
                    const result = await cloudinaryHelper.uploadBuffer(req.files.image[0].buffer, 'bingold/news/images');
                    req.body.image = result.secure_url;
                }
            }

            if (!title || !status || !category) {
                throw new ApiError(400, 'title, status, and category are required');
            }

            const news = await NewsService.createNews(req.body, req.user.pda_user_id);

            res.status(201).json({
                success: true,
                message: 'News created successfully',
                data: news
            });
        } catch (error) {
            next(error);
        }
    }

    async getNewsList(req, res, next) {
        try {
            const { page, limit, ...filters } = req.body;
            const result = await NewsService.getNewsList(
                parseInt(page, 10) || 1,
                parseInt(limit, 10) || 10,
                filters
            );
            res.json({
                success: true,
                message: 'News retrieved successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getNews(req, res, next) {
        try {
            const { id } = req.body;
            if (!id) {
                throw new ApiError(400, 'News id is required');
            }
            const news = await NewsService.getNewsById(id);
            res.json({
                success: true,
                message: 'News fetched successfully',
                data: news
            });
        } catch (error) {
            next(error);
        }
    }

    async updateNews(req, res, next) {
        try {
            const { id } = req.body;
            if (!id) {
                throw new ApiError(400, 'News id is required');
            }

            if (req.files) {
                if (req.files.cover_image && req.files.cover_image[0]) {
                    const result = await cloudinaryHelper.uploadBuffer(req.files.cover_image[0].buffer, 'bingold/news/cover');
                    req.body.cover_image = result.secure_url;
                }
                if (req.files.image && req.files.image[0]) {
                    const result = await cloudinaryHelper.uploadBuffer(req.files.image[0].buffer, 'bingold/news/images');
                    req.body.image = result.secure_url;
                }
            }
            const news = await NewsService.updateNews(id, req.body);
            res.json({
                success: true,
                message: 'News updated successfully',
                data: news
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteNews(req, res, next) {
        try {
            const { id } = req.body;
            if (!id) {
                throw new ApiError(400, 'News id is required');
            }
            const result = await NewsService.deleteNews(id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new NewsController();
