import { z } from "zod";
import { recoveryQuestions } from "../constants/recoveryQuestions";

const emailSchema = z.string().trim().email("Enter a valid email address").max(254).transform((email) => email.toLowerCase());
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password cannot exceed 72 characters")
  .regex(/[A-Za-z]/, "Password must contain a letter")
  .regex(/[0-9]/, "Password must contain a number")
  .refine((password) => Buffer.byteLength(password, "utf8") <= 72, "Password is too long");

export const registerSchema = z.object({
  fullName: z.string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(80, "Full name cannot exceed 80 characters"),
  email: emailSchema,
  password: passwordSchema,
  recoveryQuestion: z.enum(recoveryQuestions),
  recoveryAnswer: z.string().trim().min(3, "Recovery answer must be at least 3 characters").max(100),
  role: z.enum(["customer", "supplier"]).optional().default("customer"),
}).strict();

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string()
    .min(1, "Password is required")
    .max(72, "Invalid email or password")
    .refine((password) => Buffer.byteLength(password, "utf8") <= 72, "Invalid email or password"),
}).strict();

export const profileSchema = z.object({
  fullName: z.string().trim().min(3).max(80).optional(),
  email: emailSchema.optional(),
}).strict().refine(
  (profile) => profile.fullName !== undefined || profile.email !== undefined,
  "Provide a name or email to update",
);

export const notificationPreferenceSchema = z.object({
  notificationsEnabled: z.boolean(),
}).strict();

export const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, "Current password is required")
    .max(72, "Invalid current password")
    .refine((password) => Buffer.byteLength(password, "utf8") <= 72, "Invalid current password"),
  newPassword: passwordSchema,
}).strict();

export const recoveryQuestionLookupSchema = z.object({
  email: emailSchema,
}).strict();

export const setRecoveryQuestionSchema = z.object({
  currentPassword: z.string()
    .min(1, "Current password is required")
    .max(72, "Invalid current password")
    .refine((password) => Buffer.byteLength(password, "utf8") <= 72, "Invalid current password"),
  recoveryQuestion: z.enum(recoveryQuestions),
  recoveryAnswer: z.string().trim().min(3).max(100),
}).strict();

export const recoverPasswordSchema = z.object({
  email: emailSchema,
  recoveryAnswer: z.string().trim().min(1).max(100),
  newPassword: passwordSchema,
}).strict();
