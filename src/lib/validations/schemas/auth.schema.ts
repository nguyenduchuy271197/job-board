import { z } from "zod";
import { AUTH_ERRORS } from "@/constants/error-messages";

// Register schema
export const registerSchema = z.object({
  email: z
    .string({ required_error: AUTH_ERRORS.EMAIL_REQUIRED })
    .email({ message: AUTH_ERRORS.EMAIL_INVALID })
    .min(1, { message: AUTH_ERRORS.EMAIL_REQUIRED }),
  password: z
    .string({ required_error: AUTH_ERRORS.PASSWORD_REQUIRED })
    .min(8, { message: AUTH_ERRORS.WEAK_PASSWORD }),
  confirmPassword: z
    .string({ required_error: AUTH_ERRORS.PASSWORD_REQUIRED }),
  fullName: z
    .string({ required_error: AUTH_ERRORS.FULL_NAME_REQUIRED })
    .min(1, { message: AUTH_ERRORS.FULL_NAME_REQUIRED })
    .max(100, { message: "Họ tên không được quá 100 ký tự" }),
  role: z.enum(["candidate", "employer"], {
    required_error: AUTH_ERRORS.ROLE_REQUIRED,
    invalid_type_error: AUTH_ERRORS.ROLE_REQUIRED,
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: AUTH_ERRORS.PASSWORD_MISMATCH,
  path: ["confirmPassword"],
});

// Login schema
export const loginSchema = z.object({
  email: z
    .string({ required_error: AUTH_ERRORS.EMAIL_REQUIRED })
    .email({ message: AUTH_ERRORS.EMAIL_INVALID })
    .min(1, { message: AUTH_ERRORS.EMAIL_REQUIRED }),
  password: z
    .string({ required_error: AUTH_ERRORS.PASSWORD_REQUIRED })
    .min(1, { message: AUTH_ERRORS.PASSWORD_REQUIRED }),
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: AUTH_ERRORS.EMAIL_REQUIRED })
    .email({ message: AUTH_ERRORS.EMAIL_INVALID })
    .min(1, { message: AUTH_ERRORS.EMAIL_REQUIRED }),
});

// Reset password schema
export const resetPasswordSchema = z.object({
  password: z
    .string({ required_error: AUTH_ERRORS.PASSWORD_REQUIRED })
    .min(8, { message: AUTH_ERRORS.WEAK_PASSWORD }),
  confirmPassword: z
    .string({ required_error: AUTH_ERRORS.PASSWORD_REQUIRED }),
  token: z.string().min(1, { message: "Token là bắt buộc" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: AUTH_ERRORS.PASSWORD_MISMATCH,
  path: ["confirmPassword"],
});

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z
    .string({ required_error: "Mật khẩu hiện tại là bắt buộc" })
    .min(1, { message: "Mật khẩu hiện tại là bắt buộc" }),
  newPassword: z
    .string({ required_error: AUTH_ERRORS.PASSWORD_REQUIRED })
    .min(8, { message: AUTH_ERRORS.WEAK_PASSWORD }),
  confirmNewPassword: z
    .string({ required_error: AUTH_ERRORS.PASSWORD_REQUIRED }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: AUTH_ERRORS.PASSWORD_MISMATCH,
  path: ["confirmNewPassword"],
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>; 