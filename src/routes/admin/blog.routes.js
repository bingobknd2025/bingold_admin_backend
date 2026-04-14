// routes/admin/blog.routes.js
const router = require("express").Router();
const blogController = require("../../controllers/blog.controller");
const checkPermission = require("../../middleware/permission.middleware");
const upload = require("../../middleware/upload.middleware");

const uploadFields = upload.fields([
    { name: 'cover_image', maxCount: 1 },
    { name: 'attch', maxCount: 1 }
]);

router.post("/create", checkPermission('blog.create'), uploadFields, blogController.createBlog);
router.post("/list", checkPermission('blog.list'), blogController.getBlogs);
router.post("/view", checkPermission('blog.view'), blogController.getBlog);
router.post("/update", checkPermission('blog.update'), uploadFields, blogController.updateBlog);
router.post("/delete", checkPermission('blog.delete'), blogController.deleteBlog);

module.exports = router;
