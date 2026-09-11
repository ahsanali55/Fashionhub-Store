import { Request, Response } from "express";
import { Category } from "../models/category.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

// Get all categories (Public)
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
    console.log("get all categories request");
  const categories = await Category.find({}).sort({ name: 1 });
  if (!categories || categories.length === 0) {
    return res.status(200).json(new ApiResponse("No categories found", []));
  }
  return res.status(200).json(new ApiResponse("Categories fetched successfully", categories));
});

// Create a category (Admin only)
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
    console.log("create category request", req.body);

  const { name, description } = req.body;
  if (!name) {
    throw new ApiError(400, "Category name is required");
  }

  const existing = await Category.findOne({ name });
  if (existing) {
    throw new ApiError(400, "Category already exists");
  }

  const category = await Category.create({ name, description });
  return res.status(201).json(new ApiResponse("Category created successfully", category));
});