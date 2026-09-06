import { Request, Response } from "express";
import { Product } from "../models/product.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer: Buffer): Promise<any> => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { folder: "fashionhub/products" },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      },
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await Product.find().populate("supplier", "name email");
    return res
      .status(200)
      .json(new ApiResponse("Products fetched successfully", products));
  },
);

export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id).populate(
      "supplier",
      "name email",
    );
    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    return res
      .status(200)
      .json(new ApiResponse("Product fetched successfully", product));
  },
);

export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("Create Product request ", req);
    const { name, description, price, category, stock } = req.body;

    if (!req.file) {
      throw new ApiError(400, "Product image is required");
    }

    const cloudinaryResponse = await uploadToCloudinary(req.file.buffer);

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image: cloudinaryResponse.secure_url,
      supplier: req.user?._id,
    });

    return res
      .status(201)
      .json(new ApiResponse("Product created successfully", product));
  },
);

export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("Update Product request ", req.body);
    const product = await Product.findById(req.params.id);
    console.log("Req Params ", req.params.id);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // Ensure ONLY the specific supplier who owns this product can update it
    if (product.supplier.toString() !== req.user?._id?.toString()) {
      throw new ApiError(403, "Unauthorized to update this product");
    }

    let imageUrl = product.image;
    if (req.file) {
      const cloudinaryResponse = await uploadToCloudinary(req.file.buffer);
      imageUrl = cloudinaryResponse.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: imageUrl,
      },
      { new: true, runValidators: true },
    );

    return res
      .status(200)
      .json(
        new ApiResponse("Product updated successfully", updatedProduct),
      );
  },
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (
      product.supplier.toString() !== req.user?._id.toString() &&
      req.user?.role !== "admin"
    ) {
      throw new ApiError(403, "Unauthorized to delete this product");
    }

    await product.deleteOne();

    return res
      .status(200)
      .json(new ApiResponse("Product deleted successfully", null));
  },
);
