import multer from "multer";
import storage from "../configs/multer.config.js";

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // Max size: 20MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "application/pdf",
      "video/mp4",
      "video/mpeg",
    ];
    allowedTypes.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Invalid file type"), false);
  },
});




// Error handling middleware
 const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors
      return res.status(400).json({
        success: false,
        message: err.message
      });
    } else if (err) {
      // Custom errors from fileFilter
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  };


export {upload,handleMulterError}
