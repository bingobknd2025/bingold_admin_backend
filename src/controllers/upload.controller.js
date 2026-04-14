const cloudinary = require("../../config/cloudinary");

class UploadController {

  async uploadFile(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "File is required" });
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "uploads",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      return res.json({
        success: true,
        message: "File uploaded successfully",
        data: {
          url: result.secure_url,
          public_id: result.public_id,
        }

      });

    } catch (e) {
      next(e);
    }
  }

  async deleteFile(req, res, next) {
    try {
      const { public_id } = req.body;

      if (!public_id) {
        return res.status(400).json({ message: "public_id is required" });
      }

      // Try deleting as image, then video, then raw
      const resourceTypes = ["image", "video", "raw"];
      let deleted = false;
      let lastError = null;
      for (const type of resourceTypes) {
        try {
          const result = await cloudinary.uploader.destroy(public_id, { resource_type: type });
          if (result.result === "ok" || result.result === "not found") {
            deleted = true;
            break;
          }
        } catch (err) {
          lastError = err;
        }
      }

      if (deleted) {
        return res.json({
          success: true,
          message: "File deleted successfully",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Failed to delete file. It may not exist or an error occurred.",
          error: lastError ? lastError.message : undefined,
        });
      }
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UploadController();
