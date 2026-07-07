import { Request, Response, NextFunction } from "express"; import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { ApiError } from "../utils/ApiError";

interface JwtPayload { id: string; } 
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new ApiError(401, "Authentication required");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, "User not found");
  }
  req.user = user;
  next();
};