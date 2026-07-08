import jwt, { SignOptions } from "jsonwebtoken";
export const generateAccessToken = (userId: string, role: string): string => {
  return jwt.sign(
    {
      id: userId,
      role
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES as SignOptions["expiresIn"],
    }
  );
};