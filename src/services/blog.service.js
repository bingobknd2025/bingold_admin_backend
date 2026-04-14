// services/blog.service.js

const db = require('../models');
const { Blog, PdaUser } = db;
const ApiError = require('../utils/apiError.util');
const slugify = require('slugify');

class BlogService {

    // ✅ Slug generator as class method
    async generateUniqueSlug(title, slug) {
        let baseSlug = slug
            ? slugify(slug, { lower: true, strict: true })
            : slugify(title, { lower: true, strict: true });

        let uniqueSlug = baseSlug;
        let counter = 1;

        while (true) {
            const exists = await Blog.findOne({ where: { slug: uniqueSlug } });
            if (!exists) break;

            uniqueSlug = `${baseSlug}-${counter}`;
            counter++;
        }

        return uniqueSlug;
    }

    // ✅ Create Blog
    async createBlog(data, userId) {
        const finalSlug = await this.generateUniqueSlug(data.title, data.slug);

        const blog = await Blog.create({
            title: data.title,
            slug: finalSlug,
            status: data.status,
            category: data.category,
            meta_title: data.meta_title || null,
            meta_description: data.meta_description || null,
            meta_keyword: data.meta_keyword || null,
            note: data.note || null,
            attch: data.attch || null,
            cover_image: data.cover_image || null,
            dstatus: data.dstatus !== undefined ? data.dstatus : '0',
            user_id: userId
        });

        return blog;
    }

    // ✅ Get Blog By ID
    async getBlogById(id) {
        const blog = await Blog.findByPk(id, {
            include: [
                {
                    model: PdaUser,
                    as: 'author',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        if (!blog) {
            throw new ApiError(404, 'Blog not found');
        }

        return blog;
    }

    // ✅ Get Blogs (Pagination + Filters)
    async getBlogs(page = 1, limit = 10, filters = {}) {
        const offset = (page - 1) * limit;
        const where = {};

        if (filters.search) {
            where[db.Sequelize.Op.or] = [
                { title: { [db.Sequelize.Op.like]: `%${filters.search}%` } },
                { category: { [db.Sequelize.Op.like]: `%${filters.search}%` } }
            ];
        }

        if (filters.category) {
            where.category = filters.category;
        }

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.user_id) {
            where.user_id = filters.user_id;
        }

        const { count, rows } = await Blog.findAndCountAll({
            where,
            include: [
                {
                    model: PdaUser,
                    as: 'author',
                    attributes: ['id', 'name', 'email']
                }
            ],
            limit,
            offset,
            order: [['created_at', 'DESC']]
        });

        return {
            total: count,
            page,
            totalPages: Math.ceil(count / limit),
            blogs: rows
        };
    }

    // ✅ Update Blog
    async updateBlog(id, data) {
        const blog = await this.getBlogById(id);

        // slug change case
        if (data.slug && data.slug !== blog.slug) {
            const newSlug = await this.generateUniqueSlug(data.title || blog.title, data.slug);
            data.slug = newSlug;
        }

        // prevent updating restricted fields
        delete data.id;
        delete data.user_id;
        delete data.created_at;
        delete data.updated_at;

        return blog.update(data);
    }

    // ✅ Delete Blog
    async deleteBlog(id) {
        const blog = await this.getBlogById(id);
        await blog.destroy();

        return {
            success: true,
            message: 'Blog deleted successfully'
        };
    }
}

module.exports = new BlogService();