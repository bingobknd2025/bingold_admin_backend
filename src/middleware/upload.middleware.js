const multer = require("multer");

const storage = multer.memoryStorage();

// 20MB per file overall; individual features apply their own tighter limits
// (investor company documents are capped at 5MB each in their service).
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
});

module.exports = upload;
