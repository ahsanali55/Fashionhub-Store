// When a customer submits a review, we want to save it and automatically recalculate the product's average rating so it updates dynamically across your app.
import { Request, Response } from "express";
import { Review } from "../models/review.model";
import { Product } from "../models/product.model";
import { Order } from "../models/order.model";
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
  const { rating, comment } = req.body;
  const productId = req.params.id;
  if (typeof productId !== "string" || !/^[a-f\d]{24}$/i.test(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }
  const numericRating = Number(rating);
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    throw new ApiError(400, "Rating must be a whole number between 1 and 5");
  }
  if (typeof comment !== "string" || !comment.trim() || comment.trim().length > 1000) {
    throw new ApiError(400, "Review comment must be between 1 and 1000 characters");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({ productId, userId: req.user?._id });
  if (existingReview) {
    throw new ApiError(400, "You have already reviewed this product");
  }

  const deliveredOrder = await Order.exists({
    userId: req.user?._id,
    items: { $elemMatch: { productId, status: "delivered" } },
  });
  if (!deliveredOrder) {
    throw new ApiError(403, "You can review a product after its order has been delivered");
  }

  let review;
  try {
    review = await Review.create({
      productId,
      userId: req.user?._id,
      rating: numericRating,
      comment: comment.trim(),
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      throw new ApiError(400, "You have already reviewed this product");
    }
    throw error;
  }

  // Recalculate product rating
  await updateProductRating(productId);

  return res.status(201).json(
    new ApiResponse("Review added successfully", review)
  );
});

// 2. Get all reviews for a specific product
export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const productId = req.params.id;
  if (typeof productId !== "string" || !/^[a-f\d]{24}$/i.test(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const reviews = await Review.find({ productId })
    .populate("userId", "fullName avatar")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse("Product reviews fetched successfully", reviews)
  );
});
