import { Request, Response } from "express";
import { Product } from "../models/product.model";
import cloudinary from "../config/cloudinary";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Category } from "../models/category.model";
import { uploadImage } from "../utils/uploadImage";

const parseProductFields = (body: Request["body"]) => {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const price = Number(body.price);
  const stock = Number(body.stock);

  if (name.length < 2 || name.length > 120) {
    throw new ApiError(400, "Product name must be between 2 and 120 characters.");
  }
  if (description.length < 5 || description.length > 5000) {
    throw new ApiError(400, "Product description must be between 5 and 5000 characters.");
  }
  if (!Number.isFinite(price) || price < 0.01 || price > 1000000000) {
    throw new ApiError(400, "Enter a valid product price greater than zero.");
  }
  if (!Number.isInteger(stock) || stock < 0) {
    throw new ApiError(400, "Stock must be a non-negative whole number.");
  }
  if (!category) throw new ApiError(400, "Choose a product category.");

  return { name, description, category, price, stock };
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
    if (req.user?.role === "supplier" && req.user?.status === "rejected") {
      throw new ApiError(
        403,
        "Your supplier account has been rejected. You cannot create products.",
      );
    }

    if (req.user?.role === "supplier" && req.user?.status !== "approved") {
      throw new ApiError(
        403,
        "Your supplier account is pending admin approval. You cannot create products yet.",
      );
    } 

    const fields = parseProductFields(req.body);

    // 🔍 Validate that the category exists in the Admin's category list
    const validCategory = await Category.findOne({ name: fields.category });
    if (!validCategory) {
      throw new ApiError(400, "Choose a category provided by the admin.");
    }

    if (!req.file?.buffer) {
      throw new ApiError(400, "Product image is required");
    }

    const image = await uploadImage(req.file.buffer, "fashionhub/products");

    let product;
    try {
      product = await Product.create({
        ...fields,
        image,
        supplier: req.user?._id,
      });
    } catch (error) {
      await deleteFromCloudinary(image);
      throw error;
    }

    return res
      .status(201)
      .json(new ApiResponse("Product created successfully", product));
  },
);

export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // Ensure ONLY the specific supplier who owns this product can update it
    if (product.supplier.toString() !== req.user?._id?.toString()) {
      throw new ApiError(403, "Unauthorized to update this product");
    }

    const fields = parseProductFields(req.body);
    const validCategory = await Category.findOne({ name: fields.category });
    if (!validCategory) throw new ApiError(400, "Choose a category provided by the admin.");

    const imageUrl = req.file?.buffer
      ? await uploadImage(req.file.buffer, "fashionhub/products")
      : product.image;
    let updatedProduct;
    try {
      updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          ...fields,
          image: imageUrl,
        },
        { new: true, runValidators: true },
      );
    } catch (error) {
      if (req.file?.buffer) await deleteFromCloudinary(imageUrl);
      throw error;
    }
    if (!updatedProduct) {
      if (req.file?.buffer) await deleteFromCloudinary(imageUrl);
      throw new ApiError(404, "Product not found");
    }
    if (req.file?.buffer && product.image) await deleteFromCloudinary(product.image);

    return res
      .status(200)
      .json(new ApiResponse("Product updated successfully", updatedProduct));
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
