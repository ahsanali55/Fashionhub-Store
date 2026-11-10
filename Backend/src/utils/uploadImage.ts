import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";
import { ApiError } from "./ApiError";

export const uploadImage = (buffer: Buffer, folder: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary image upload failed", error);
          reject(new ApiError(502, "Image upload failed. Please try again."));
          return;
        }
        if (!result?.secure_url) {
          reject(new ApiError(502, "Image upload did not return a valid image URL."));
          return;
        }
        resolve(result.secure_url);
      },
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
