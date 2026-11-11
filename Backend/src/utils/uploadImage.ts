import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";
import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { ApiError } from "./ApiError";

const hasCloudinaryCredentials = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );

const uploadToCloudinary = (buffer: Buffer, folder: string): Promise<string> =>
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

const extensionForMimeType: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export const uploadImage = async (
  buffer: Buffer,
  folder: string,
  publicBaseUrl: string,
  mimeType: string,
): Promise<string> => {
  if (hasCloudinaryCredentials()) {
    return uploadToCloudinary(buffer, folder);
  }

  const extension = extensionForMimeType[mimeType];
  if (!extension) {
    throw new ApiError(400, "Upload a JPG, PNG, WebP, or GIF image.");
  }

  const fileName = `${randomUUID()}${extension}`;
  const uploadDirectory = path.resolve(__dirname, "../../uploads");
  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(path.join(uploadDirectory, fileName), buffer, { flag: "wx" });
  return `${(process.env.BACKEND_PUBLIC_URL || publicBaseUrl).replace(/\/+$/, "")}/uploads/${fileName}`;
};

export const deleteLocalImage = async (imageUrl: string): Promise<boolean> => {
  let pathname: string;
  try {
    pathname = new URL(imageUrl).pathname;
  } catch {
    return false;
  }

  if (!pathname.startsWith("/uploads/")) return false;
  const fileName = path.basename(pathname);
  if (
    fileName !== pathname.slice("/uploads/".length) ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp|gif)$/i.test(fileName)
  ) {
    throw new ApiError(400, "Invalid local image path.");
  }

  try {
    await unlink(path.resolve(__dirname, "../../uploads", fileName));
  } catch (error) {
    if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") {
      throw error;
    }
  }
  return true;
};
