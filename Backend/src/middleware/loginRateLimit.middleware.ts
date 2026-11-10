import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

const windowMs = 15 * 60 * 1000;
const maxAttempts = 10;
const attemptsByIp = new Map<string, { count: number; resetAt: number }>();

export const limitLoginAttempts = (req: Request, res: Response, next: NextFunction) => {
  const now = Date.now();
  for (const [ip, entry] of attemptsByIp) {
    if (entry.resetAt <= now) attemptsByIp.delete(ip);
  }

  const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
  const entry = attemptsByIp.get(ip);
  if (!entry || entry.resetAt <= now) {
    attemptsByIp.set(ip, { count: 0, resetAt: now + windowMs });
  }

  const activeEntry = attemptsByIp.get(ip)!;
  if (activeEntry.count >= maxAttempts) {
    res.setHeader("Retry-After", Math.ceil((activeEntry.resetAt - now) / 1000));
    throw new ApiError(429, "Too many sign-in attempts. Try again in 15 minutes.");
  }

  res.once("finish", () => {
    if (res.statusCode < 400) {
      attemptsByIp.delete(ip);
      return;
    }
    activeEntry.count += 1;
  });
  next();
};

const recoveryAttemptsByIp = new Map<string, { count: number; resetAt: number }>();

export const limitPasswordRecoveryAttempts = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const now = Date.now();
  for (const [ip, entry] of recoveryAttemptsByIp) {
    if (entry.resetAt <= now) recoveryAttemptsByIp.delete(ip);
  }

  const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
  const entry = recoveryAttemptsByIp.get(ip);
  if (!entry || entry.resetAt <= now) {
    recoveryAttemptsByIp.set(ip, { count: 0, resetAt: now + windowMs });
  }

  const activeEntry = recoveryAttemptsByIp.get(ip)!;
  if (activeEntry.count >= maxAttempts) {
    res.setHeader("Retry-After", Math.ceil((activeEntry.resetAt - now) / 1000));
    throw new ApiError(429, "Too many password recovery attempts. Try again in 15 minutes.");
  }

  activeEntry.count += 1;
  next();
};
