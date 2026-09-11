import { Request, Response } from "express";
import { Wishlist } from "../models/wishlist.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  let wishlist = await Wishlist.findOne({ userId: req.user?._id }).populate(
    "products",
    "name price image",
  );
  if (!wishlist) {
    wishlist = await Wishlist.create({ userId: req.user?._id, products: [] });
    return res.status(200).json(new ApiResponse("Wishlist is empty, Please add items to your wishlist", wishlist));
  }
  return res
    .status(200)
    .json(new ApiResponse("Wishlist fetched successfully", wishlist));
});

export const toggleWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ userId: req.user?._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId: req.user?._id,
        products: [productId],
      });
    } else {
      const exists = wishlist.products.includes(productId);
      if (exists) {
        wishlist.products = wishlist.products.filter(
          (id) => id.toString() !== productId,
        );
      } else {
        wishlist.products.push(productId);
      }
      await wishlist.save();
    }

    return res
      .status(200)
      .json(new ApiResponse("Wishlist updated successfully", wishlist));
  },
);
