import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { ApiError } from "../utils/ApiError";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ success: false, message: err.message, });
    return;
  } 
  if (err instanceof multer.MulterError) {
    const statusCode = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    res.status(statusCode).json({
      success: false,
      message: err.code === "LIMIT_FILE_SIZE"
        ? "Image must be 5 MB or smaller."
        : "Invalid image upload.",
    });
    return;
  }
  console.error(err); 
  res.status(500).json({ success: false, message: "Internal Server Error", });
};