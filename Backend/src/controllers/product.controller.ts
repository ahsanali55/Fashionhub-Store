import { Request, Response } from "express";
import { Product } from "../models/product.model";
import cloudinary from "../config/cloudinary";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Category } from "../models/category.model";
import { uploadImage } from "../utils/uploadImage";
import { createNotification } from "../utils/notificationHelper";
import { Cart } from "../models/cart.model";
import { Wishlist } from "../models/wishlist.model";
import { deleteLocalImage } from "../utils/uploadImage";
import User from "../models/user.model";
import mongoose from "mongoose";
import { getActiveApprovedSupplierIds } from "../utils/supplierAvailability";

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
  if (await deleteLocalImage(imageUrl)) return;
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return;
  }
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
    const activeSupplierIds = await getActiveApprovedSupplierIds();
    const products = await Product.find({
      isVisible: { $ne: false },
      supplier: { $in: activeSupplierIds },
    }).populate("supplier", "fullName email");
    return res
      .status(200)
      .json(new ApiResponse("Products fetched successfully", products));
  },
);

export const getAllProductsForAdmin = asyncHandler(
  async (_req: Request, res: Response) => {
    const products = await Product.find().populate("supplier", "fullName email");
    return res.status(200).json(new ApiResponse("Products fetched successfully", products));
  },
);

export const importSampleProductsForAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const items = req.body?.products;
    if (!Array.isArray(items) || items.length === 0 || items.length > 100) {
      throw new ApiError(400, "Provide between 1 and 100 products to import.");
    }

    const products = items.map((value: unknown, index: number) => {
      if (!value || typeof value !== "object") {
        throw new ApiError(400, `Product ${index + 1} is invalid.`);
      }
      const item = value as Record<string, unknown>;
      const name = typeof item.name === "string" ? item.name.trim() : "";
      const brand = typeof item.brand === "string" ? item.brand.trim() : "";
      const description =
        typeof item.description === "string" ? item.description.trim() : "";
      const category =
        typeof item.category === "string" ? item.category.trim() : "";
      const image = typeof item.image === "string" ? item.image.trim() : "";
      const supplierId =
        typeof item.supplierId === "string" ? item.supplierId : "";
      const price = Number(item.price);
      const stock = Number(item.stock);
      const rating = Number(item.rating ?? 0);
      const numReviews = Number(item.reviews ?? 0);
      const keywords = Array.isArray(item.keywords) ? item.keywords : [];

      if (!name || name.length > 120 || !description || description.length > 5000) {
        throw new ApiError(400, `Product ${index + 1} has an invalid name or description.`);
      }
      if (!brand || brand.length > 120 || !category) {
        throw new ApiError(400, `Product ${index + 1} must have a brand and category.`);
      }
      if (!Number.isFinite(price) || price < 0.01 || price > 1000000000) {
        throw new ApiError(400, `Product ${index + 1} has an invalid price.`);
      }
      if (!Number.isInteger(stock) || stock < 0) {
        throw new ApiError(400, `Product ${index + 1} has invalid stock.`);
      }
      if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
        throw new ApiError(400, `Product ${index + 1} has an invalid rating.`);
      }
      if (!Number.isInteger(numReviews) || numReviews < 0) {
        throw new ApiError(400, `Product ${index + 1} has an invalid review count.`);
      }
      if (
        keywords.length > 30 ||
        keywords.some((keyword) => typeof keyword !== "string" || keyword.length > 60)
      ) {
        throw new ApiError(400, `Product ${index + 1} has invalid keywords.`);
      }
      if (!mongoose.Types.ObjectId.isValid(supplierId)) {
        throw new ApiError(400, `Product ${index + 1} must be assigned to a supplier.`);
      }
      try {
        const imageUrl = new URL(image);
        if (!["http:", "https:"].includes(imageUrl.protocol)) throw new Error();
      } catch {
        throw new ApiError(400, `Product ${index + 1} must have a valid image URL.`);
      }

      return {
        name,
        brand,
        description,
        category,
        image,
        price,
        stock,
        rating,
        numReviews,
        keywords: keywords.map((keyword: string) => keyword.trim()).filter(Boolean),
        isNewProduct: item.isNew === true,
        supplier: new mongoose.Types.ObjectId(supplierId),
      };
    });

    const supplierIds = [...new Set(products.map((product) => product.supplier.toString()))];
    const suppliers = await User.find({
      _id: { $in: supplierIds },
      role: "supplier",
      status: "approved",
      isActive: true,
    }).select("_id");
    if (suppliers.length !== supplierIds.length) {
      throw new ApiError(400, "Every product must be assigned to an active, approved supplier.");
    }

    const categoryNames = [...new Set(products.map((product) => product.category))];
    const categories = await Category.find({}).select("name");
    const categoryNamesByLowercase = new Map(
      categories.map((category) => [category.name.trim().toLowerCase(), category.name]),
    );
    for (const categoryName of categoryNames) {
      const normalizedName = categoryName.toLowerCase();
      if (categoryNamesByLowercase.has(normalizedName)) continue;

      try {
        const category = await Category.create({
          name: categoryName,
          description: `${categoryName} products`,
        });
        categoryNamesByLowercase.set(normalizedName, category.name);
      } catch (error) {
        const isDuplicateKey =
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === 11000;
        if (!isDuplicateKey) throw error;

        const category = await Category.findOne({ name: categoryName }).select("name");
        if (!category) throw error;
        categoryNamesByLowercase.set(normalizedName, category.name);
      }
    }
    for (const product of products) {
      product.category = categoryNamesByLowercase.get(product.category.toLowerCase())!;
    }

    const existingProducts = await Product.find({
      brand: { $in: [...new Set(products.map((product) => product.brand))] },
      name: { $in: products.map((product) => product.name) },
    }).select("name brand supplier");
    const existingByCatalogKey = new Map(
      existingProducts.map((product) => [
        `${product.brand?.trim().toLowerCase()}:${product.name.trim().toLowerCase()}`,
        product,
      ]),
    );
    const productsToCreate = products.filter(
      (product) =>
        !existingByCatalogKey.has(
          `${product.brand.toLowerCase()}:${product.name.toLowerCase()}`,
        ),
    );
    const createdProducts = productsToCreate.length
      ? await Product.insertMany(productsToCreate)
      : [];

    const productsToReassign = products.filter((product) => {
      const existing = existingByCatalogKey.get(
        `${product.brand.toLowerCase()}:${product.name.toLowerCase()}`,
      );
      return existing && existing.supplier.toString() !== product.supplier.toString();
    });
    const reassignedProducts = [];
    for (const product of productsToReassign) {
      const existing = existingByCatalogKey.get(
        `${product.brand.toLowerCase()}:${product.name.toLowerCase()}`,
      )!;
      const updated = await Product.findByIdAndUpdate(
        existing._id,
        { $set: { supplier: product.supplier } },
        { new: true, runValidators: true },
      );
      if (!updated) {
        throw new ApiError(409, `Unable to reassign "${product.name}". Please retry the import.`);
      }
      reassignedProducts.push(updated);
    }

    const unchanged = products.length - createdProducts.length - reassignedProducts.length;
    const refreshedProducts = await Product.populate(
      [...createdProducts, ...reassignedProducts],
      { path: "supplier", select: "fullName email" },
    );
    return res.status(201).json(
      new ApiResponse("Sample catalog import completed", {
        created: createdProducts.length,
        reassigned: reassignedProducts.length,
        unchanged,
        products: refreshedProducts,
      }),
    );
  },
);

export const getSupplierProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await Product.find({ supplier: req.user?._id })
      .populate("supplier", "fullName email");
    return res.status(200).json(new ApiResponse("Supplier products fetched successfully", products));
  },
);

export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const activeSupplierIds = await getActiveApprovedSupplierIds();
    const product = await Product.findOne({
      _id: req.params.id,
      isVisible: { $ne: false },
      supplier: { $in: activeSupplierIds },
    }).populate(
      "supplier",
      "fullName email",
    );
    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    return res
      .status(200)
      .json(new ApiResponse("Product fetched successfully", product));
  },
);

export const setProductVisibility = asyncHandler(
  async (req: Request, res: Response) => {
    const { isVisible } = req.body as { isVisible: boolean };
    if (typeof isVisible !== "boolean") {
      throw new ApiError(400, "isVisible must be a boolean value");
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { isVisible } },
      { new: true, runValidators: true },
    );
    if (!product) throw new ApiError(404, "Product not found");

    const message = isVisible
      ? `${product.name} is visible in the marketplace again.`
      : `${product.name} was hidden from the marketplace by an administrator.`;
    await createNotification(
      product.supplier.toString(),
      message,
      isVisible ? "PRODUCT_RESTORED" : "PRODUCT_HIDDEN",
      { productId: product._id.toString() },
    );

    return res.status(200).json(
      new ApiResponse(`Product ${isVisible ? "shown" : "hidden"} successfully`, product),
    );
  },
);

export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    if (req.user?.role === "supplier" && req.user?.status !== "approved") {
      throw new ApiError(
        403,
        "Your supplier account is not approved. You cannot create products.",
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

    const image = await uploadImage(
      req.file.buffer,
      "fashionhub/products",
      `${req.protocol}://${req.get("host")}`,
      req.file.mimetype,
    );

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
      ? await uploadImage(
          req.file.buffer,
          "fashionhub/products",
          `${req.protocol}://${req.get("host")}`,
          req.file.mimetype,
        )
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
    await product.deleteOne();
    await Promise.all([
      Cart.updateMany({}, { $pull: { items: { productId: product._id } } }),
      Wishlist.updateMany({}, { $pull: { products: product._id } }),
    ]);
    if (product.image) await deleteFromCloudinary(product.image);

    return res
      .status(200)
      .json(new ApiResponse("Product deleted successfully", null));
  },
);
