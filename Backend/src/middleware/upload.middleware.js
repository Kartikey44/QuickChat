import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

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
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images and documents are allowed"), false);
  }
};

export const uploadChatImage = multer({ storage: chatStorage });
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_images",
     resource_type: "image",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

export const uploadProfileImage = multer({ storage: profileStorage ,limits: {
    fileSize: 5 * 1024 * 1024, 
  },});