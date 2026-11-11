import { Request, Response } from "express";
import {
  deleteFromCloudinary,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../services/auth.service";
import User from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { generateAccessToken } from "../utils/generateAccessToken";
import { generateRefreshToken } from "../utils/generateRefreshToken";
import { ApiError } from "../utils/ApiError";
import { IUser } from "../interfaces/user.interface";
import { uploadImage } from "../utils/uploadImage";
import bcrypt from "bcrypt";

const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

const serializeAuthUser = (user: IUser) => ({
  id: user._id.toString(),
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  notificationsEnabled: user.notificationsEnabled ?? true,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// Register controller
export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = await registerUser(req.body);
    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());
    user.refreshToken = refreshToken;
    await user.save();
    res
      .cookie("accessToken", accessToken, { ...authCookieOptions, maxAge: 15 * 60 * 1000 })
      .cookie("refreshToken", refreshToken, { ...authCookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .status(201)
      .json(new ApiResponse("User registered successfully.", { user: serializeAuthUser(user) }));
  },
);

// Login controller
export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = await loginUser(req.body);

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    // Save refresh token in database
    await User.findByIdAndUpdate(user._id, {
      refreshToken,
    });

    res
      .cookie("accessToken", accessToken, {
        ...authCookieOptions,
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .cookie("refreshToken", refreshToken, {
        ...authCookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json(
        new ApiResponse("Login successful.", {
          user: serializeAuthUser(user),
        }),
      );
  },
);
// Getting the current logged in user
export const getCurrentUserProfile = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new ApiError(401, "Authentication required");
    res.json({
      success: true,
      user: serializeAuthUser(req.user),
    });
  },
);

// getting the customer dashboard
export const getCustomerDashboard = asyncHandler((req, res) => {
  res.json({
    success: true,
    message: "Welcome Customer!",
    user: req.user ? serializeAuthUser(req.user) : null,
  });
});

// getting the supplier dashboard
export const getSupplierDashboard = asyncHandler((req, res) => {
  res.json({
    success: true,
    message: "Welcome Supplier!",
    user: req.user ? serializeAuthUser(req.user) : null,
  });
});

// getting the admin dashboard
export const getAdminDashboard = asyncHandler((req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin!",
    user: req.user ? serializeAuthUser(req.user) : null,
  });
});

// refresh access token controller
export const refreshToken = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const refreshTokenCookie = req.cookies.refreshToken;
    const user = await refreshAccessToken(refreshTokenCookie);
    const accessToken = generateAccessToken(user._id.toString(), user.role);

    res
      .cookie("accessToken", accessToken, {
        ...authCookieOptions,
        maxAge: 15 * 60 * 1000,
      })
      .status(200)
      .json(new ApiResponse("Access token refreshed successfully.", {}));
  },
);

// logout controller
export const logout = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
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
    res.status(200).json(
      new ApiResponse("Current user fetched successfully.", {
        user: {
          id: req.user._id,
          fullName: req.user.fullName,
          email: req.user.email,
          role: req.user.role,
          avatar: req.user.avatar,
          notificationsEnabled: req.user.notificationsEnabled ?? true,
          createdAt: req.user.createdAt,
          updatedAt: req.user.updatedAt,
        },
      }),
    );
  },
);

// Update Avatar controller
export const updateAvatar = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file?.buffer) {
    throw new ApiError(400, "Avatar image file is missing");
  }

  // Upload new image to Cloudinary
  const userId = req.user?._id;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const previousAvatar = user.avatar;
  const avatar = await uploadImage(
    req.file.buffer,
    "fashionhub/avatars",
    `${req.protocol}://${req.get("host")}`,
    req.file.mimetype,
  );
  user.avatar = avatar;
  try {
    await user.save();
  } catch (error) {
    await deleteFromCloudinary(avatar);
    throw error;
  }
  if (previousAvatar) await deleteFromCloudinary(previousAvatar);

  return res.status(200).json(
    new ApiResponse("Avatar updated successfully.", { avatar: user.avatar })
  );
});

// Update Profile controller
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email } = req.body;

  // Build a dynamic update object so only provided fields are changed
  const updateData: { fullName?: string; email?: string } = {};

  if (fullName !== undefined) {
    updateData.fullName = fullName.trim();
  }

  if (email !== undefined) {
    // Check if the new email is already taken by another user
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail, _id: { $ne: req.user?._id } });
    if (existingUser) {
      throw new ApiError(400, "Email is already in use by another account");
    }
    updateData.email = normalizedEmail;
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: updateData },
    { returnDocument: "after", runValidators: true }
  ).select("-password");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse("Profile updated successfully", serializeAuthUser(updatedUser))
  );
});

export const updateNotificationPreference = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { notificationsEnabled: req.body.notificationsEnabled } },
    { new: true, runValidators: true },
  );
  if (!user) throw new ApiError(404, "User not found");
  return res.status(200).json(
    new ApiResponse("Notification preference saved", {
      notificationsEnabled: user.notificationsEnabled,
    }),
  );
});

export const changePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) throw new ApiError(401, "Authentication required");

  const user = await User.findById(req.user._id).select("+password");
  if (!user) throw new ApiError(404, "User not found");

  const { currentPassword, newPassword } = req.body as {
    currentPassword: string;
    newPassword: string;
  };
  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(400, "Current password is incorrect");
  }
  if (await user.comparePassword(newPassword)) {
    throw new ApiError(400, "New password must be different from your current password");
  }

  user.password = newPassword;
  const refreshToken = generateRefreshToken(user._id.toString());
  user.refreshToken = refreshToken;
  await user.save();

  const accessToken = generateAccessToken(user._id.toString(), user.role);
  res
    .cookie("accessToken", accessToken, {
      ...authCookieOptions,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...authCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json(new ApiResponse("Password changed successfully.", {}));
});

export const getPasswordRecoveryQuestion = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const email = String(req.body.email).trim().toLowerCase();
    const user = await User.findOne({ email }).select("+recoveryAnswerHash");
    res.status(200).json(
      new ApiResponse("Recovery question lookup completed.", {
        question: user?.recoveryAnswerHash ? user.recoveryQuestion : null,
      }),
    );
  },
);

export const recoverPassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, recoveryAnswer, newPassword } = req.body as {
      email: string;
      recoveryAnswer: string;
      newPassword: string;
    };
    const user = await User.findOne({ email: email.trim().toLowerCase() })
      .select("+password +recoveryAnswerHash");
    if (
      !user ||
      !user.recoveryAnswerHash ||
      !(await bcrypt.compare(recoveryAnswer.trim().toLocaleLowerCase(), user.recoveryAnswerHash))
    ) {
      throw new ApiError(400, "Unable to verify your recovery answer. Check your details or contact support.");
    }

    if (await user.comparePassword(newPassword)) {
      throw new ApiError(400, "Choose a password different from your current password.");
    }

    user.password = newPassword;
    user.refreshToken = null;
    await user.save();

    res.status(200).json(
      new ApiResponse("Password reset successfully. You can now sign in.", {}),
    );
  },
);

export const setPasswordRecoveryQuestion = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new ApiError(401, "Authentication required");
    const user = await User.findById(req.user._id).select("+password");
    if (!user) throw new ApiError(404, "User not found");

    const { currentPassword, recoveryQuestion, recoveryAnswer } = req.body as {
      currentPassword: string;
      recoveryQuestion: string;
      recoveryAnswer: string;
    };
    if (!(await user.comparePassword(currentPassword))) {
      throw new ApiError(400, "Current password is incorrect");
    }

    user.recoveryQuestion = recoveryQuestion;
    user.recoveryAnswerHash = await bcrypt.hash(recoveryAnswer.trim().toLocaleLowerCase(), 12);
    await user.save();
    res.status(200).json(new ApiResponse("Recovery question updated successfully.", {}));
  },
);