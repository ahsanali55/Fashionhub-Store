// This for Avatar Image Uploadsimport multer from "multer";
import multer from "multer";
import fs from "fs";
import path from "path";

// Automatically ensure public/temp exists when multer is loaded
const uploadDir = path.join(__dirname, "../../public/temp");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });