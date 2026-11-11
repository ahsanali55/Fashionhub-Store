import { Document } from "mongoose";

export type UserRole = "customer" | "supplier" | "admin";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  recoveryQuestion?: string | null;
  recoveryAnswerHash?: string | null;
  role: UserRole;
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
  notificationsEnabled: boolean;
  refreshToken?: string | null;
  avatar?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}