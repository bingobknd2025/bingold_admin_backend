// routes/admin/news.routes.js
const router = require("express").Router();
const newsController = require("../../controllers/news.controller");
const checkPermission = require("../../middleware/permission.middleware");
const upload = require("../../middleware/upload.middleware");

const uploadFields = upload.fields([
    { name: 'cover_image', maxCount: 1 }
]);

router.post("/create", checkPermission('news.create'), uploadFields, newsController.createNews);
router.post("/list", checkPermission('news.list'), newsController.getNewsList);
router.post("/view", checkPermission('news.view'), newsController.getNews);
router.post("/update", checkPermission('news.update'), uploadFields, newsController.updateNews);
router.post("/delete", checkPermission('news.delete'), newsController.deleteNews);

module.exports = router;
