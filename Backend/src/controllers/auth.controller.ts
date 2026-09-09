import { Request, Response } from "express";
import { refreshAccessToken, registerUser } from "../services/auth.service";
import User from "../models/user.model";
import { loginUser } from "../services/auth.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { logoutUser } from "../services/auth.service";
import { generateAccessToken } from "../utils/generateAccessToken";
import { generateRefreshToken } from "../utils/generateRefreshToken";
import { ApiError } from "../utils/ApiError";
import { forgotPassword } from "../services/auth.service";
import { resetPassword } from "../services/auth.service";

// Register controller
export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    console.log("Register request ", req.body);

    const user = await registerUser(req.body);
    const accessToken = generateAccessToken(user._id.toString(), user.role);
    res.status(201).json(
      new ApiResponse("User registered successfully.", {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
        accessToken,
      }),
    );
  },
);

// Login controller
export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    console.log("Login request ", req.body);
    const user = await loginUser(req.body);

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    // Save refresh token in database
    await User.findByIdAndUpdate(user._id, {
      refreshToken,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
    };
    res
      .cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json(
        new ApiResponse("Login successful.", {
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
          },
        }),
      );
  },
);
// Getting the current logged in user
export const getCurrentUserProfile = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    console.log("Getting current user profile request ");

    res.json({
      success: true,
      user: req.user,
    });
  },
);

// getting the customer dashboard
export const getCustomerDashboard = asyncHandler((req, res) => {
  console.log("Getting customer dashboard request ", req.body);

  res.json({
    success: true,
    message: "Welcome Customer!",
    user: req.user,
  });
});

// getting the supplier dashboard
export const getSupplierDashboard = asyncHandler((req, res) => {
  console.log("Getting supplier dashboard request ", req.body);

  res.json({
    success: true,
    message: "Welcome Supplier!",
    user: req.user,
  });
});

// getting the admin dashboard
export const getAdminDashboard = asyncHandler((req, res) => {
  console.log("Getting admin dashboard request ", req.body);

  res.json({
    success: true,
    message: "Welcome Admin!",
    user: req.user,
  });
});

// refresh access token controller
export const refreshToken = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    console.log("Refresh token request ", req.body);

    const refreshTokenCookie = req.cookies.refreshToken;
    const user = await refreshAccessToken(refreshTokenCookie);
    const accessToken = generateAccessToken(user._id.toString(), user.role);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      })
      .status(200)
      .json(new ApiResponse("Access token refreshed successfully.", {}));
  },
);

// logout controller
export const logout = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    console.log("Logout request ", req.body);
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }
    await logoutUser(req.user._id.toString());
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
    };
    res
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .status(200)
      .json(new ApiResponse("Logout successful.", {}));
  },
);

// get current logged user
export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }
    console.log("Getting current user profile request ", req.body);
    res.status(200).json(
      new ApiResponse("Current user fetched successfully.", {
        user: {
          id: req.user._id,
          fullName: req.user.fullName,
          email: req.user.email,
          role: req.user.role,
          createdAt: req.user.createdAt,
          updatedAt: req.user.updatedAt,
        },
      }),
    );
  },
);

// Forgot Password controller
export const forgotPasswordController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    console.log("Forgot password request ", req.body);
    const { email } = req.body;

    const { resetToken } = await forgotPassword(email);

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    res.status(200).json(
      new ApiResponse("Password reset link generated.", {
        resetUrl,
      }),
    );
  },
);

// Reset Passward
export const resetPasswordController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    console.log("Reset password request ", req.body);
    const { token } = req.params;
    const { password } = req.body;
    if (Array.isArray(token)) {
      throw new Error("Invalid reset token.");
    }
    await resetPassword(token as string, password);
    res.status(200).json(new ApiResponse("Password reset successfully.", {}));
  },
);

