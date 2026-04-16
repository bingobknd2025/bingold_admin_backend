// controllers/public/blog.public.controller.js
const db = require('../../models');
const { Blog, PdaUser } = db;
const ApiError = require('../../utils/apiError.util');

class PublicBlogController {
    async listBlogs(req, res, next) {
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

            const { count, rows } = await Blog.findAndCountAll({
                where,
                attributes: [
                    'id',
                    ['user_id', 'BlogUser_id'],
                    'title',
                    'slug',
                    'status',
                    'dstatus',
                    'meta_title',
                    'meta_description',
                    'meta_keyword',
                    'note',
                    'created_at',
                    'updated_at',
                    'attch',
                    'cover_image',
                    'category'
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
                    BlogUser_id: data.BlogUser_id,
                    title: data.title,
                    slug: data.slug,
                    status: data.status === 'active' ? 'live' : data.status,
                    dstatus: data.dstatus,
                    meta_title: data.meta_title,
                    meta_description: data.meta_description,
                    meta_keyword: data.meta_keyword,
                    note: data.note,
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                    attch: data.attch,
                    cover_image: data.cover_image,
                    blog_type: data.category
                };
            });

            res.json({
                success: true,
                message: 'Blogs retrieved successfully',
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

    async getBlogBySlug(req, res, next) {
        try {
            const { slug } = req.params;

            if (!slug) {
                throw new ApiError(400, 'Blog slug is required');
            }

            const blog = await Blog.findOne({
                where: {
                    slug,
                    status: 'active',
                    dstatus: '0'
                },
                attributes: [
                    'id',
                    ['user_id', 'BlogUser_id'],
                    'title',
                    'slug',
                    'status',
                    'dstatus',
                    'meta_title',
                    'meta_description',
                    'meta_keyword',
                    'note',
                    'created_at',
                    'updated_at',
                    'attch',
                    'cover_image',
                    'category'
                ]
            });

            if (!blog) {
                throw new ApiError(404, 'Blog not found');
            }

            const data = blog.toJSON();

            res.json({
                success: true,
                message: 'Blog fetched successfully',
                data: {
                    id: data.id,
                    BlogUser_id: data.BlogUser_id,
                    title: data.title,
                    slug: data.slug,
                    status: data.status === 'active' ? 'live' : data.status,
                    dstatus: data.dstatus,
                    meta_title: data.meta_title,
                    meta_description: data.meta_description,
                    meta_keyword: data.meta_keyword,
                    note: data.note,
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                    attch: data.attch,
                    cover_image: data.cover_image,
                    blog_type: data.category
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PublicBlogController();
