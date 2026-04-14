// services/news.service.js
const db = require('../models');
const { News, PdaUser } = db;
const ApiError = require('../utils/apiError.util');
const slugify = require('slugify');

async function generateUniqueSlug(title, slug) {
    let baseSlug = slug
        ? slugify(slug, { lower: true, strict: true })
        : slugify(title, { lower: true, strict: true });

    let uniqueSlug = baseSlug;
    let counter = 1;

    while (true) {
        const exists = await News.findOne({ where: { slug: uniqueSlug } });
        if (!exists) break;

        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
    }

    return uniqueSlug;
}

class NewsService {
    async createNews(data, userId) {
        const finalSlug = await generateUniqueSlug(data.title, data.slug);

        const news = await News.create({
            title: data.title,
            slug: finalSlug,
            short_description: data.short_description || null,
            description: data.description || null,
            status: data.status || 'active',
            category: data.category,
            meta_title: data.meta_title || null,
            meta_description: data.meta_description || null,
            meta_keyword: data.meta_keyword || null,
            cover_image: data.cover_image || null,
            published_at: data.published_at || null,
            dstatus: data.dstatus !== undefined ? data.dstatus : '0',
            user_id: userId
        });

        return news;
    }

    async getNewsById(id) {
        const news = await News.findByPk(id, {
            include: [
                {
                    model: PdaUser,
                    as: 'author',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        if (!news) {
            throw new ApiError(404, 'News not found');
        }

        return news;
    }

    async getNewsList(page = 1, limit = 10, filters = {}) {
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

        const { count, rows } = await News.findAndCountAll({
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
            data: rows
        };
    }

    async updateNews(id, data) {
        const news = await this.getNewsById(id);

        // slug change case
        if (data.slug && data.slug !== news.slug) {
            const existing = await News.findOne({ where: { slug: data.slug } });
            if (existing && existing.id !== id) {
                throw new ApiError(409, 'News with this slug already exists');
            }
        } else if (data.title && data.title !== news.title && !data.slug) {
            data.slug = await generateUniqueSlug(data.title, null);
        }

        // prevent updating restricted fields
        delete data.id;
        delete data.user_id;
        delete data.created_at;
        delete data.updated_at;

        return news.update(data);
    }

    async deleteNews(id) {
        const news = await this.getNewsById(id);
        await news.destroy();
        return { success: true, message: 'News deleted successfully' };
    }
}

module.exports = new NewsService();
