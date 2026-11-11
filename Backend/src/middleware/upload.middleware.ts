import multer from "multer";
import { ApiError } from "../utils/ApiError";

// This for Product Image Uploads
// A StorageEngine responsible for processing files uploaded via Multer.
// Multer using memory storage so you can easily stream the file buffer directly to Cloudinary
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype)) {
      callback(new ApiError(400, "Upload a JPG, PNG, WebP, or GIF image"));
      return;
    }
    callback(null, true);
  },
});