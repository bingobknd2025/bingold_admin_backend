const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Usually Cloudinary is configured via environment variables.
// If you have a separate config file, you could require it here instead.
if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
}

class UploadController {
    async uploadFile(req, res, next) {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No file provided' });
            }

            const stream = cloudinary.uploader.upload_stream(
                { folder: "bingold", resource_type: "auto" },
                (error, result) => {
                    if (error) {
                        return res.status(500).json({ success: false, message: error.message || 'Upload failed' });
                    }
                    res.status(200).json({
                        success: true,
                        message: "File uploaded successfully",
                        data: {
                            url: result.secure_url,
                            public_id: result.public_id,
                            format: result.format,
                            resource_type: result.resource_type
                        }
                    });
                }
            );

            // Send buffer to cloudinary
            const { Readable } = require('stream');
            const readableStream = new Readable();
            readableStream.push(req.file.buffer);
            readableStream.push(null);
            readableStream.pipe(stream);

        } catch (error) {
            next(error);
        }
    }

    async deleteFile(req, res, next) {
        try {
            const { public_id } = req.body;
            if (!public_id) {
                return res.status(400).json({ success: false, message: 'public_id is required' });
            }

            const result = await cloudinary.uploader.destroy(public_id);
            res.status(200).json({
                success: true,
                message: "File deleted successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UploadController();
