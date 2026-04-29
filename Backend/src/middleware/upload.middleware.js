import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../lib/cloundinary.js";

// Chat images
const chatStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "chat_images",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

export const uploadChatImage = multer({ storage: chatStorage });

// Profile images
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_images",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

export const uploadProfileImage = multer({ storage: profileStorage });