import jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES as SignOptions["expiresIn"],
    }
  );
};