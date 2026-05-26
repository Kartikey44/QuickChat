import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../config/cloudinary.js";

/* -------------------------------- */
/* File Filter */
/* -------------------------------- */

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    // Images
    "image/jpeg",
    "image/png",
    "image/jpg",

    // Videos
    "video/mp4",
    "video/webm",
    "video/quicktime",

    // Documents
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
    cb(
      new Error(
        "Only images, videos, and documents are allowed"
      ),
      false
    );
  }
};

/* -------------------------------- */
/* Chat Media Storage */
/* -------------------------------- */

const chatStorage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    let resource_type = "auto";

    return {
      folder: "chat_media",

      resource_type,

      allowed_formats: [
        // Images
        "jpg",
        "jpeg",
        "png",

        // Videos
        "mp4",
        "mov",
        "webm",

        // Docs
        "pdf",
        "txt",
        "doc",
        "docx",
        "xls",
        "xlsx",
        "ppt",
        "pptx",
        "zip",
      ],
    };
  },
});

export const uploadChatImage = multer({
  storage: chatStorage,

  fileFilter,

  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

/* -------------------------------- */
/* Profile Storage */
/* -------------------------------- */

const profileStorage = new CloudinaryStorage({
  cloudinary,

  params: {
    folder: "profile_images",

    resource_type: "image",

    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
    ],
  },
});

export const uploadProfileImage = multer({
  storage: profileStorage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});