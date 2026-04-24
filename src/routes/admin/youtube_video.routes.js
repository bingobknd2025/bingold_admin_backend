// routes/admin/youtube_video.routes.js
const router = require("express").Router();
const youtubeVideoController = require("../../controllers/youtube_video.controller");
const checkPermission = require("../../middleware/permission.middleware");

router.post("/create", checkPermission('youtube_video.create'), youtubeVideoController.createVideo);
router.post("/list", checkPermission('youtube_video.list'), youtubeVideoController.getVideoList);
router.post("/view", checkPermission('youtube_video.view'), youtubeVideoController.getVideo);
router.post("/update", checkPermission('youtube_video.update'), youtubeVideoController.updateVideo);
router.post("/delete", checkPermission('youtube_video.delete'), youtubeVideoController.deleteVideo);

module.exports = router;
