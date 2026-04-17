import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: result.secure_url, 
      public_id: result.public_id,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
};