import { Request, Response } from "express";
import User from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { createNotification } from "../utils/notificationHelper";

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

    const alreadyApproved = supplier.status === "approved";
    supplier.status = "approved";
    await supplier.save();
    if (!alreadyApproved) {
      await createNotification(
        supplier._id.toString(),
        "Your supplier account has been approved. You can now list products and manage your store.",
        "SUPPLIER_APPROVED",
      );
    }

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

    const alreadyRejected = supplier.status === "rejected";
    supplier.status = "rejected";
    await supplier.save();
    if (!alreadyRejected) {
      await createNotification(
        supplier._id.toString(),
        "Your supplier application was not approved. Contact the store administrator if you need more information.",
        "SUPPLIER_REJECTED",
      );
    }

    return res
      .status(200)
      .json(new ApiResponse("Supplier rejected successfully", supplier));
  },
);

// Get all users (Admin only)
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse("All users fetched successfully", users));
});

// Suspend or activate a user account
export const suspendOrActivateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body; // boolean (true/false)
  console.log("Suspend or activate a user account request body:", req.body);

  if (typeof isActive !== "boolean") {
    throw new ApiError(400, "isActive status must be a boolean value");
  }

  const user = await User.findByIdAndUpdate(
    id,
    { isActive },
    { returnDocument: "after" }
  ).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(`User account has been ${isActive ? "activated" : "suspended"} successfully`, user)
  );
});