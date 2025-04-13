import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { multiple_upload } from "../controllers/upload.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const Upload_router = express.Router();

Upload_router.post("/upload-multiple", protectRoute,upload.array("files", 10), multiple_upload); 
//making searise of auth middlewares to figureout users identity
export default Upload_router;
