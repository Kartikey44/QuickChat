import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../lib/cloundinary.js";

// Chat images
const chatStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "chat_images",
    allowed_formats: ["jpg", "png", "jpeg",
      //documents
    "pdf", "txt",
    "doc", "docx",
    "xls", "xlsx",
    "ppt", "pptx",
    "zip"],
  },
});

export const uploadChatImage = multer({ storage: chatStorage });
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_images",
     resource_type: "auto",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

export const uploadProfileImage = multer({ storage: profileStorage });