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
// Helper to extract Cloudinary public ID and delete old image
const deleteFromCloudinary = async (imageUrl: string) => {
  try {
    const parts = imageUrl.split("/");
    const filenameWithExtension = parts[parts.length - 1];
    const publicIdWithFolder = `fashionhub/products/${filenameWithExtension.split(".")[0]}`;
    await cloudinary.uploader.destroy(publicIdWithFolder);
  } catch (error) {
    console.error("Error deleting old image from Cloudinary:", error);
  }
};

export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("Get All Product request ", req.body);
    const products = await Product.find().populate("supplier", "name email");
    return res
      .status(200)
      .json(new ApiResponse("Products fetched successfully", products));
  },
);

export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("Get Product by ID request ", req.body);

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
      // 1. Upload new image to Cloudinary
      const cloudinaryResponse = await uploadToCloudinary(req.file.buffer);
      
      // 2. Delete the old image from Cloudinary if it exists
      if (product.image) {
        await deleteFromCloudinary(product.image);
      }
      
      // 3. Assign new image URL
      imageUrl = cloudinaryResponse.secure_url;
    }

    // Update the product with new data and the new image URL into the database
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: imageUrl,
      },
      { new: true, runValidators: true }
    );

    return res
      .status(200)
      .json(
        new ApiResponse("Product updated successfully", updatedProduct)
      );
  }
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("Delete Product request ", req.body);

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
    // Delete the product image from Cloudinary if it exists
    if (product.image) {
        await deleteFromCloudinary(product.image);
      }
    await product.deleteOne();

    return res
      .status(200)
      .json(new ApiResponse("Product deleted successfully", null));
  },
);
