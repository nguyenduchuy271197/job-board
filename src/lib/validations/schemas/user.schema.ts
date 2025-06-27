import { z } from "zod";
import { USER_ERRORS } from "@/constants/error-messages";

// Phone number validation for Vietnam
const phoneRegex = /^(\+84|84|0)([1-9]\d{8,9})$/;

// URL validation
const urlRegex = /^https?:\/\/.+\..+/;

// Update profile schema
export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: "Họ tên là bắt buộc" })
    .max(100, { message: "Họ tên không được quá 100 ký tự" })
    .optional(),
  phone: z
    .string()
    .regex(phoneRegex, { message: USER_ERRORS.PHONE_INVALID })
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .max(200, { message: "Địa điểm không được quá 200 ký tự" })
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(500, { message: USER_ERRORS.BIO_TOO_LONG })
    .optional()
    .or(z.literal("")),
  linkedinUrl: z
    .string()
    .regex(urlRegex, { message: USER_ERRORS.LINKEDIN_URL_INVALID })
    .optional()
    .or(z.literal("")),
  portfolioUrl: z
    .string()
    .regex(urlRegex, { message: USER_ERRORS.PORTFOLIO_URL_INVALID })
    .optional()
    .or(z.literal("")),
});

// Upload avatar schema  
export const uploadAvatarSchema = z.object({
  avatar: z
    .instanceof(File, { message: "File là bắt buộc" })
    .refine(file => file.size <= 5 * 1024 * 1024, {
      message: "File không được vượt quá 5MB"
    })
    .refine(file => ["image/jpeg", "image/png", "image/webp"].includes(file.type), {
      message: "Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)"
    }),
});

// Update role schema (admin only)
export const updateRoleSchema = z.object({
  userId: z.string().uuid({ message: "User ID không hợp lệ" }),
  role: z.enum(["candidate", "employer", "admin"], {
    required_error: "Vai trò là bắt buộc",
    invalid_type_error: "Vai trò không hợp lệ",
  }),
});

// Deactivate user schema (admin only)
export const deactivateUserSchema = z.object({
  userId: z.string().uuid({ message: "User ID không hợp lệ" }),
  reason: z
    .string()
    .min(1, { message: "Lý do vô hiệu hóa là bắt buộc" })
    .max(500, { message: "Lý do không được quá 500 ký tự" }),
});

// Get user profile schema
export const getUserProfileSchema = z.object({
  userId: z.string().uuid({ message: "User ID không hợp lệ" }).optional(),
});

// Type exports
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UploadAvatarInput = z.infer<typeof uploadAvatarSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type DeactivateUserInput = z.infer<typeof deactivateUserSchema>;
export type GetUserProfileInput = z.infer<typeof getUserProfileSchema>; 