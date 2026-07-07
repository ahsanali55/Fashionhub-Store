import { z } from "zod";
export const registerSchema = z.object(
  {
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["customer", "supplier", "admin"]).optional().default("customer"),

  });
export const loginSchema = z.object(
  {
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }
);