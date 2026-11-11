import { Request, Response, NextFunction } from "express"; 
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { ApiError } from "../utils/ApiError";

interface JwtPayload { id: string; } 
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : undefined;
  const token = req.cookies?.accessToken || bearerToken;
  if (!token) {
    throw new ApiError(401, "Authentication required");
  }
  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
  } catch {
    throw new ApiError(401, "Invalid or expired authentication token");
  }
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, "User not found");
  }
  if (!user.isActive) {
    throw new ApiError(403, "This account is disabled");
  }
  req.user = user;
  next();
};