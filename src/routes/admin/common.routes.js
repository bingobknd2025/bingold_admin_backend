const router = require("express").Router();
const authToken = require("../../middleware/auth.middleware");
const upload = require("../../middleware/upload.middleware");
const uploadController = require("../../controllers/common/upload.controller");

router.post("/upload-file", authToken, upload.single("file"), uploadController.uploadFile);
router.delete("/delete-file", authToken, uploadController.deleteFile);

module.exports = router; 
