import { Request, Response, NextFunction, RequestHandler } from "express";

// Instead of wrapping every controller in try/catch, we'll use a reusable wrapper.

export const asyncHandler = (
  fn: RequestHandler
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};