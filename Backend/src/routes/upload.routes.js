import express from "express";
import upload from "../middleware/multer.middleware.js";
import { uploadImage } from "../controllers/upload.controller.js";
const router = express.Router();
router.post("/upload", upload.single("image"), uploadImage);
export default router;