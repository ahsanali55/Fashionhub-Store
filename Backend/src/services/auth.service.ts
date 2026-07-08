import User from "../models/user.model";
import { IUser } from "../interfaces/user.interface";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { generatePasswordResetToken } from "../utils/generatePasswordResetToken";


interface RegisterUserData {
  fullName: string;
  email: string;
  password: string;
  role?: "customer" | "supplier";
}

export const registerUser = async (
  data: RegisterUserData
): Promise<IUser> => {
  const { fullName, email, password, role = "customer" } = data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    role,
  });

  return user;
};

interface LoginUserData {
  email: string;
  password: string;
}

export const loginUser = async (
  data: LoginUserData
): Promise<IUser> => {
  const { email, password } = data;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(404, "Invalid email or password.");
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    throw new ApiError(404, "Invalid email or password.");
  }

  return user;
};

// create a function to refresh access token using refresh token 
interface RefreshTokenPayload { id: string; }

export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is missing.");
  }
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as RefreshTokenPayload;
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, "User not found.");

  }
  if (user.refreshToken !== refreshToken) {
    throw new ApiError(401, "Invalid refresh token.");
  }
  return user;
};

//  create a function to logout user by clearing refresh token from database
export const logoutUser = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId,
    {
      $unset: {
        refreshToken: 1,
      },
    });
};

// create a function to generate password reset token and save it to the user document
export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found.");
  }
  const { resetToken, hashedToken, } = generatePasswordResetToken();
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes 
  await user.save();
  return { user, resetToken, };
};

// reset password function to reset the password using the reset token
export const resetPassword = async (token: string, password: string) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex"); const user = await User.findOne(
    {
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        $gt: new Date(),
      },
    });
  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token.");
  }
  user.password = password;
  user.passwordResetToken = null; 
  user.passwordResetExpires = null; // Force logout from all devices 
  user.refreshToken = null;
  await user.save();
  return user;
};