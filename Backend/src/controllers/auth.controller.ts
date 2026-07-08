import { Request, Response } from "express";
import { registerUser } from "../services/auth.service";
import generateToken from "../utils/generateToken";
import User from "../models/user.model";
import { IUser } from "../interfaces/user.interface";
import { loginUser } from "../services/auth.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// Register controller
export const register = asyncHandler(
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const user = await registerUser(req.body);

    const token = generateToken(user);

    res.status(201).json(
      new ApiResponse(
        "User registered successfully.",
        {
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
          },
          token,
        }
      )
    );
  }
);

// Login controller
export const login = asyncHandler(
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    const user = await loginUser(req.body);

    const token = generateToken(user);

    res.status(200).json(
      new ApiResponse(
        "Login successful.",
        {
          "token": token
        }
      )
    );
  }
);
// Getting the current logged in user
export const getCurrentUserProfile = asyncHandler(
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    res.json(
      {
        success: true,
        user: req.user
      }
    );
  }
)

// getting the customer dashboard
export const getCustomerDashboard = asyncHandler(
  (req, res) => {
    res.json(
      {
        success: true,
        message: "Welcome Customer!",
        user: req.user,
      });
  }
);

// getting the supplier dashboard
export const getSupplierDashboard = asyncHandler(
  (req, res) => {
    res.json(
      {
        success: true,
        message: "Welcome Supplier!",
        user: req.user,
      });
  }
);

// getting the admin dashboard
export const getAdminDashboard = asyncHandler(
  (req, res) => {
    res.json(
      {
        success: true,
        message: "Welcome Admin!",
        user: req.user,
      });
  }
);
