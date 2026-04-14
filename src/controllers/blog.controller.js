// controllers/blog.controller.js
const BlogService = require('../services/blog.service');
const ApiError = require('../utils/apiError.util');
const cloudinaryHelper = require('../utils/cloudinaryHelper.util');

class BlogController {
    async createBlog(req, res, next) {
        try {
            if (!req.user || !req.user.pda_user_id) {
                throw new ApiError(401, 'Unauthorized');
            }

            const {
                title,
                slug,
                status,
                category,
                meta_title,
                meta_description,
                meta_keyword,
                note,
                attch,
                cover_image
            } = req.body;

            // Process file uploads if they exist
            if (req.files) {
                if (req.files.cover_image && req.files.cover_image[0]) {
                    const result = await cloudinaryHelper.uploadBuffer(req.files.cover_image[0].buffer, 'bingold/blogs/cover');
                    req.body.cover_image = result.secure_url;
                }
                if (req.files.attch && req.files.attch[0]) {
                    const result = await cloudinaryHelper.uploadBuffer(req.files.attch[0].buffer, 'bingold/blogs/attch');
                    req.body.attch = result.secure_url;
                }
            }

            if (!title || !status || !category) {
                throw new ApiError(400, 'title, status, and category are required');
            }

            const blog = await BlogService.createBlog(req.body, req.user.pda_user_id);

            res.status(201).json({
                success: true,
                message: 'Blog created successfully',
                data: blog
            });
        } catch (error) {
            next(error);
        }
    }

    async getBlogs(req, res, next) {
        try {
            const { page, limit, ...filters } = req.body;
            const result = await BlogService.getBlogs(
                parseInt(page, 10) || 1,
                parseInt(limit, 10) || 10,
                filters
            );
            res.json({
                success: true,
                message: 'Blogs retrieved successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getBlog(req, res, next) {
        try {
            const { id } = req.body;
            if (!id) {
                throw new ApiError(400, 'Blog id is required');
            }
            const blog = await BlogService.getBlogById(id);
            res.json({
                success: true,
                message: 'Blog fetched successfully',
                data: blog
            });
        } catch (error) {
            next(error);
        }
    }

    async updateBlog(req, res, next) {
        try {
            const { id } = req.body;
            if (!id) {
                throw new ApiError(400, 'Blog id is required');
            }

            if (req.files) {
                if (req.files.cover_image && req.files.cover_image[0]) {
                    const result = await cloudinaryHelper.uploadBuffer(req.files.cover_image[0].buffer, 'bingold/blogs/cover');
                    req.body.cover_image = result.secure_url;
                }
                if (req.files.attch && req.files.attch[0]) {
                    const result = await cloudinaryHelper.uploadBuffer(req.files.attch[0].buffer, 'bingold/blogs/attch');
                    req.body.attch = result.secure_url;
                }
            }
            const blog = await BlogService.updateBlog(id, req.body);
            res.json({
                success: true,
                message: 'Blog updated successfully',
                data: blog
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteBlog(req, res, next) {
        try {
            const { id } = req.body;
            if (!id) {
                throw new ApiError(400, 'Blog id is required');
            }
            const result = await BlogService.deleteBlog(id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new BlogController();
