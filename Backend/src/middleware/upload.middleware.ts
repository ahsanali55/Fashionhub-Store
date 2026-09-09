import multer from "multer";

// This for Product Image Uploads
// A StorageEngine responsible for processing files uploaded via Multer.
// Multer using memory storage so you can easily stream the file buffer directly to Cloudinary
const storage = multer.memoryStorage();
export const upload = multer({ storage });