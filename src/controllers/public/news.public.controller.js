// controllers/public/news.public.controller.js
const db = require('../../models');
const { News, PdaUser } = db;
const ApiError = require('../../utils/apiError.util');

class PublicNewsController {

    async listNews(req, res, next) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const offset = (page - 1) * limit;

            const where = {
                status: 'active',
                dstatus: '0'
            };

            if (req.query.category) {
                where.category = req.query.category;
            }

            const { count, rows } = await News.findAndCountAll({
                where,
                attributes: [
                    'id',
                    ['user_id', 'NewsUser_id'],
                    'title',
                    'slug',
                    'short_description',
                    'status',
                    'dstatus',
                    'category',
                    'meta_title',
                    'meta_description',
                    'meta_keyword',
                    'description',
                    'created_at',
                    'updated_at',
                    'cover_image',
                    'published_at'
                ],
                limit,
                offset,
                order: [['created_at', 'DESC']]
            });

            // Map rows to match the expected response shape
            const result = rows.map(row => {
                const data = row.toJSON();
                return {
                    id: data.id,
                    NewsUser_id: data.NewsUser_id,
                    title: data.title,
                    slug: data.slug,
                    short_description: data.short_description,
                    status: data.status === 'active' ? 'live' : data.status,
                    dstatus: data.dstatus,
                    category: data.category,
                    meta_title: data.meta_title,
                    meta_description: data.meta_description,
                    meta_keyword: data.meta_keyword,
                    description: data.description,
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                    cover_image: data.cover_image,
                    published_at: data.published_at
                };
            });

            res.json({
                success: true,
                message: 'News retrieved successfully',
                data: {
                    totalRecords: count,
                    totalPages: Math.ceil(count / limit),
                    page,
                    limit,
                    result
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getNewsBySlug(req, res, next) {
        try {
            const { slug } = req.params;

            if (!slug) {
                throw new ApiError(400, 'News slug is required');
            }

            const news = await News.findOne({
                where: {
                    slug,
                    status: 'active',
                    dstatus: '0'
                },
                attributes: [
                    'id',
                    ['user_id', 'NewsUser_id'],
                    'title',
                    'slug',
                    'short_description',
                    'status',
                    'dstatus',
                    'category',
                    'meta_title',
                    'meta_description',
                    'meta_keyword',
                    'description',
                    'created_at',
                    'updated_at',
                    'cover_image',
                    'published_at'
                ]
            });

            if (!news) {
                throw new ApiError(404, 'News not found');
            }

            const data = news.toJSON();

            res.json({
                success: true,
                message: 'News fetched successfully',
                data: {
                    id: data.id,
                    NewsUser_id: data.NewsUser_id,
                    title: data.title,
                    slug: data.slug,
                    short_description: data.short_description,
                    status: data.status === 'active' ? 'live' : data.status,
                    dstatus: data.dstatus,
                    category: data.category,
                    meta_title: data.meta_title,
                    meta_description: data.meta_description,
                    meta_keyword: data.meta_keyword,
                    description: data.description,
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                    cover_image: data.cover_image,
                    published_at: data.published_at
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PublicNewsController();
