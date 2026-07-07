import { Document } from "mongoose";

export type UserRole = "customer" | "supplier" | "admin";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;

  comparePassword(candidatePassword: string): Promise<boolean>;
}