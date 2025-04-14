import cloudinary from "../configs/cloudinary.js";
import fs from  'fs';
import messageModel from "../models/message.model.js";

// 🔹 API Route for Multiple File Upload
// app.post("/upload-multiple", upload.array("files", 10), 
export const multiple_upload = async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) return res.status(400).json({ error: "No files uploaded" });
  
      const uploadPromises = req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, { resource_type: "auto" });
        fs.unlinkSync(file.path); // Delete local file after upload
        // console.log(req.user)
        return result.secure_url;
      });
  
      const urls = await Promise.all(uploadPromises);
      console.log(urls);
      
      res.status(200).json({ urls });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };   