// When a customer submits a review, we want to save it and automatically recalculate the product's average rating so it updates dynamically across your app.
import { Request, Response } from "express";
import { Review } from "../models/review.model";
import { Product } from "../models/product.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

// Helper function to recalculate and update product average rating
const updateProductRating = async (productId: string) => {
    console.log("Update Product Rating:", productId);
  const reviews = await Review.find({ productId });
  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(productId, { rating: 0, numReviews: 0 });
    return;
  }

  const totalRating = reviews.reduce((acc, item) => acc + item.rating, 0);
  const averageRating = totalRating / reviews.length;

  await Product.findByIdAndUpdate(productId, {
    rating: Number(averageRating.toFixed(1)),
    numReviews: reviews.length,
  });
};

// 1. Submit a review for a product
export const createProductReview = asyncHandler(async (req: Request, res: Response) => {
    console.log("Create Product Review Request:", req.params.id);
  const { rating, comment } = req.body;
  const productId = req.params.id as string; // Explicitly cast as string

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({ productId, userId: req.user?._id });
  if (existingReview) {
    throw new ApiError(400, "You have already reviewed this product");
  }

  const review = await Review.create({
    productId,
    userId: req.user?._id,
    rating: Number(rating),
    comment,
  });

  // Recalculate product rating
  await updateProductRating(productId);

  return res.status(201).json(
    new ApiResponse("Review added successfully", review)
  );
});

// 2. Get all reviews for a specific product
export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
    console.log("Get Product Reviews Request:", req.params.id);
  const productId = req.params.id as string; // Explicitly cast as string

  const reviews = await Review.find({ productId })
    .populate("userId", "fullName avatar")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse("Product reviews fetched successfully", reviews)
  );
});

