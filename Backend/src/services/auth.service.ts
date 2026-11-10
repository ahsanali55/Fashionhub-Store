import User from "../models/user.model";
import { IUser } from "../interfaces/user.interface";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary";
import bcrypt from "bcrypt";
interface RegisterUserData {
  fullName: string;
  email: string;
  password: string;
  recoveryQuestion: string;
  recoveryAnswer: string;
  role?: "customer" | "supplier";
}

export const registerUser = async (data: RegisterUserData): Promise<IUser> => {
  const fullName = data.fullName.trim();
  const email = data.email.trim().toLowerCase();
  const { password, recoveryQuestion, recoveryAnswer, role = "customer" } = data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  let user: IUser;
  try {
    const recoveryAnswerHash = await bcrypt.hash(recoveryAnswer.trim().toLocaleLowerCase(), 12);
    user = await User.create({
      fullName,
      email,
      password,
      role,
      recoveryQuestion,
      recoveryAnswerHash,
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      throw new ApiError(409, "An account with this email already exists");
    }
    throw error;
  }

  return user;
};

interface LoginUserData {
  email: string;
  password: string;
}

export const loginUser = async (data: LoginUserData): Promise<IUser> => {
  const { email, password } = data;

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    throw new ApiError(401, "Invalid email or password.");
  }
  if (!user.isActive) {
    throw new ApiError(403, "This account is disabled. Contact support for help.");
  }

  return user;
};

// create a function to refresh access token using refresh token
interface RefreshTokenPayload {
  id: string;
}

export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is missing.");
  }
  let decoded: RefreshTokenPayload;
  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    ) as RefreshTokenPayload;
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token.");
  }
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, "User not found.");
  }
  if (!user.isActive) {
    throw new ApiError(403, "This account is disabled.");
  }
  if (user.refreshToken !== refreshToken) {
    throw new ApiError(401, "Invalid refresh token.");
  }
  return user;
};

//  create a function to logout user by clearing refresh token from database
export const logoutUser = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, {
    $unset: {
      refreshToken: 1,
    },
  });
};

export const deleteFromCloudinary = async (imageUrl: string) => {
  try {
    if (!imageUrl) return;
    // Extract public ID from Cloudinary URL
    const parts = imageUrl.split("/");
    const filename = parts[parts.length - 1];
    const publicId = `fashionhub/avatars/${filename.split(".")[0]}`;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting old image from Cloudinary:", error);
  }
};