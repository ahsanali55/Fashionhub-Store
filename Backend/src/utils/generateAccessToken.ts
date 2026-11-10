import jwt, { SignOptions } from "jsonwebtoken";
// export const generateAccessToken = (userId: string, role: string): string => {
//   return jwt.sign(
//     {
//       id: userId,
//       role
//     },
//     process.env.JWT_SECRET!,
//     {
//       expiresIn: process.env.ACCESS_TOKEN_EXPIRES as SignOptions["expiresIn"],
//     }
//   );
// };



export const generateAccessToken = (userId: string, role: string): string => {
  // Ensure the secret exists before signing to avoid runtime errors
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is missing");
  }

  return jwt.sign(
    {
      id: userId,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN || "1h") as SignOptions["expiresIn"],
    }
  );
};