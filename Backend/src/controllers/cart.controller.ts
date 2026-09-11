import { Request, Response } from "express";
import { Cart } from "../models/cart.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

// Get user cart
export const getCart = asyncHandler(async (req: Request, res: Response) => {
  let cart = await Cart.findOne({ userId: req.user?._id }).populate("items.productId", "name price image");
  if (!cart) {
    cart = await Cart.create({ userId: req.user?._id, items: [] });
  return res.status(200).json(new ApiResponse("Cart is empty, Please add items", cart));

  }
  return res.status(200).json(new ApiResponse("Cart fetched successfully", cart));
});

// Add or update item in cart
export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    throw new ApiError(400, "Product ID and quantity are required");
  }

  let cart = await Cart.findOne({ userId: req.user?._id });
  if (!cart) {
    cart = await Cart.create({ userId: req.user?._id, items: [{ productId, quantity }] });
    return res.status(200).json(new ApiResponse("Cart created successfully, Please add items", cart));
  } else {
    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    // Update quantity if item exists, otherwise add new item
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    await cart.save();
  }

  return res.status(200).json(new ApiResponse("Cart updated successfully", cart));
});

// Remove item from cart
export const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ userId: req.user?._id });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
  await cart.save();

  return res.status(200).json(new ApiResponse("Item removed from cart", cart));
});