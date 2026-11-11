import jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";

// export const generateRefreshToken = (userId: string): string => {
//   return jwt.sign(
//     { id: userId },
//     process.env.JWT_REFRESH_SECRET!,
//     {
//       expiresIn: process.env.REFRESH_TOKEN_EXPIRES as SignOptions["expiresIn"],
//     }
//   );
// };



export const generateRefreshToken = (userId: string): string => {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN;

  // Validation prevents the 'secretOrPrivateKey must have a value' crash
  if (!secret) {
    throw new Error("CRITICAL: REFRESH_TOKEN_SECRET is missing from environment variables.");
  }

  return jwt.sign(
    { id: userId }, 
    secret, 
    {
      expiresIn: (expiresIn || "7d") as SignOptions["expiresIn"],
    }
  );
};
