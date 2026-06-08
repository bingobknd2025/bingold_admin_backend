const db = require('../../models');
const { Blog, News } = db;

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
let cache = { xml: null, expiresAt: 0 };

const STATIC_PATHS = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/about', changefreq: 'monthly', priority: '0.7' },
    { loc: '/contact', changefreq: 'monthly', priority: '0.6' },
    { loc: '/blogs', changefreq: 'daily', priority: '0.9' },
    { loc: '/news', changefreq: 'daily', priority: '0.9' },
    // { loc: '/videos', changefreq: 'weekly', priority: '0.7' },
    // { loc: '/agent-verification', changefreq: 'monthly', priority: '0.5' }
];

function escapeXml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function toW3C(date) {
    if (!date) return new Date().toISOString();
    const d = date instanceof Date ? date : new Date(date);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
    return [
        '  <url>',
        `    <loc>${escapeXml(loc)}</loc>`,
        lastmod ? `    <lastmod>${escapeXml(lastmod)}</lastmod>` : null,
        changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
        priority ? `    <priority>${priority}</priority>` : null,
        '  </url>'
    ].filter(Boolean).join('\n');
}

async function buildSitemapXml(baseUrl) {
    const base = baseUrl.replace(/\/$/, '');

    const [blogs, news, videos] = await Promise.all([
        Blog.findAll({
            where: { status: 'active', dstatus: '0' },
            attributes: ['slug', 'updated_at', 'created_at'],
            order: [['updated_at', 'DESC']]
        }),
        News.findAll({
            where: { status: 'active', dstatus: '0' },
            attributes: ['slug', 'updated_at', 'created_at', 'published_at'],
            order: [['updated_at', 'DESC']]
        })
        // YoutubeVideo.findAll({
        //     where: { status: 'active' },
        //     attributes: ['id', 'updated_at', 'created_at'],
        //     order: [['updated_at', 'DESC']]
        // }).catch(() => [])
    ]);

    const entries = [];

    for (const p of STATIC_PATHS) {
        entries.push(urlEntry({
            loc: `${base}${p.loc}`,
            lastmod: toW3C(new Date()),
            changefreq: p.changefreq,
            priority: p.priority
        }));
    }

    for (const b of blogs) {
        if (!b.slug) continue;
        entries.push(urlEntry({
            loc: `${base}/blog/${b.slug}`,
            lastmod: toW3C(b.updated_at || b.created_at),
            changefreq: 'weekly',
            priority: '0.8'
        }));
    }

    for (const n of news) {
        if (!n.slug) continue;
        entries.push(urlEntry({
            loc: `${base}/news/${n.slug}`,
            lastmod: toW3C(n.published_at || n.updated_at || n.created_at),
            changefreq: 'weekly',
            priority: '0.8'
        }));
    }

    // for (const v of videos) {
    //     entries.push(urlEntry({
    //         loc: `${base}/videos/${v.id}`,
    //         lastmod: toW3C(v.updated_at || v.created_at),
    //         changefreq: 'monthly',
    //         priority: '0.6'
    //     }));
    // }

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        entries.join('\n'),
        '</urlset>'
    ].join('\n');
}

class SitemapController {
    async getSitemap(req, res, next) {
        try {
            const now = Date.now();
            if (!cache.xml || cache.expiresAt < now) {
                const base =
                    process.env.PUBLIC_SITE_URL ||
                    process.env.PUBLIC_APP_URL ||
                    process.env.PUBLIC_VERIFY_BASE_URL ||
                    'https://bingold.to';
                cache = {
                    xml: await buildSitemapXml(base),
                    expiresAt: now + CACHE_TTL_MS
                };
            }
            res.set('Content-Type', 'application/xml; charset=utf-8');
            res.set('Cache-Control', 'public, max-age=600');
            res.status(200).send(cache.xml);
        } catch (error) {
            next(error);
        }
    }

    invalidate() {
        cache = { xml: null, expiresAt: 0 };
    }
}

module.exports = new SitemapController();
