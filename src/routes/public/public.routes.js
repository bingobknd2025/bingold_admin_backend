// routes/public/public.routes.js
const express = require('express');
const router = express.Router();

const publicBlogController = require('../../controllers/public/blog.public.controller');
const publicNewsController = require('../../controllers/public/news.public.controller');
const publicYoutubeVideoController = require('../../controllers/public/youtube_video.public.controller');
const publicAgentController = require('../../controllers/public/agent.public.controller');

// ─── Blog Public Routes ───────────────────────────────────────
// GET /api/bingold/blogs          → List all active blogs (paginated)
// GET /api/bingold/blogs/:slug    → Get single blog by slug
router.post('/blogs', publicBlogController.listBlogs);
router.post('/blogs/:slug', publicBlogController.getBlogBySlug);

// ─── News Public Routes ───────────────────────────────────────
// GET /api/bingold/news           → List all active news (paginated)
// GET /api/bingold/news/:slug     → Get single news by slug
router.post('/news', publicNewsController.listNews);
router.post('/news/:slug', publicNewsController.getNewsBySlug);

// ─── Youtube Video Public Routes ──────────────────────────────
// POST /api/bingold/youtube-videos        → List active youtube videos (paginated, optional platform filter)
// POST /api/bingold/youtube-videos/:id    → Get single youtube video by id
router.post('/youtube-videos', publicYoutubeVideoController.listVideos);
router.post('/youtube-videos/:id', publicYoutubeVideoController.getVideoById);

// ─── Agent Verification (public) ─────────────────────────────
// POST /api/bingold/agents/verify/:code  → verify agent by unique code (QR target)
// POST /api/bingold/agents/verify        → verify with code in body
router.post('/agents/verify/:code', publicAgentController.verifyAgent);
router.post('/agents/verify', publicAgentController.verifyAgent);

module.exports = router;
