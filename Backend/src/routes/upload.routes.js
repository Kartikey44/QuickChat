import express from "express";
import {uploadProfileImage} from "../middleware/upload.middleware.js";
import {protectRoute} from "../middleware/auth.middleware.js";
import { uploadImage } from "../controllers/upload.controller.js";

const router = express.Router();

router.post(
  "/upload",
  (req, res, next) => {
    console.log("➡️ Hit route");
    next();
  },

  uploadProfileImage.single("image"),
  (req, res, next) => {
    console.log("➡️ After multer", req.file);
    next(); 
  },
  protectRoute,
  (req, res, next) => {
    console.log("➡️ After auth", req.user);
    next();
  },
  uploadImage
);

export default router;