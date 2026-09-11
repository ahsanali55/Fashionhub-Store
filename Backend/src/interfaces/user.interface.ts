import { Document } from "mongoose";

export type UserRole = "customer" | "supplier" | "admin";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
  refreshToken?: string | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  avatar?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}