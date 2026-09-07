import { Request, Response } from "express";
import User from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

// Admin Supplier Approval Controllers

// 1. Get all suppliers with 'pending' status
export const getPendingSuppliers = asyncHandler(
  async (req: Request, res: Response) => {
    const pendingSuppliers = await User.find({
      role: "supplier",
      status: "pending",
    }).select("-password");

    // Check if no pending suppliers are found
    if (!pendingSuppliers || pendingSuppliers.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse("There are no pending suppliers yet", []));
    }
    
    return res
      .status(200)
      .json(
        new ApiResponse(
          "Pending suppliers fetched successfully",
          pendingSuppliers,
        ),
      );
  },
);

// 2. Approve a supplier
export const approveSupplier = asyncHandler(
  async (req: Request, res: Response) => {
    const supplier = await User.findById(req.params.id);

    if (!supplier || supplier.role !== "supplier") {
      throw new ApiError(404, "Supplier not found");
    }

    supplier.status = "approved";
    await supplier.save();

    return res
      .status(200)
      .json(new ApiResponse("Supplier approved successfully", supplier));
  },
);

// 3. Reject a supplier
export const rejectSupplier = asyncHandler(
  async (req: Request, res: Response) => {
    const supplier = await User.findById(req.params.id);

    if (!supplier || supplier.role !== "supplier") {
      throw new ApiError(404, "Supplier not found");
    }

    supplier.status = "rejected";
    await supplier.save();

    return res
      .status(200)
      .json(new ApiResponse("Supplier rejected successfully", supplier));
  },
);
