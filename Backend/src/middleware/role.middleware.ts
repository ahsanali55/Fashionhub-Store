import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { UserRole } from "../interfaces/user.interface";

// This middleware checks whether the authenticated user has
//  one of the allowed roles before allowing access to a route.
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "You are not authorized to access this resource");
    }
    next();
  };
};