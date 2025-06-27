import { z } from "zod";
import { COMPANY_ERRORS } from "@/constants/error-messages";

// Get company details schema
export const getCompanySchema = z.object({
  id: z.string().uuid({ message: "Company ID không hợp lệ" }).optional(),
  slug: z.string().min(1, { message: "Company slug là bắt buộc" }).optional(),
}).refine(data => data.id || data.slug, {
  message: "Phải cung cấp ID hoặc slug của công ty",
});

// Create company schema
export const createCompanySchema = z.object({
  name: z.string()
    .min(1, { message: COMPANY_ERRORS.COMPANY_NAME_REQUIRED })
    .max(100, { message: "Tên công ty không được quá 100 ký tự" }),
  slug: z.string()
    .min(1, { message: COMPANY_ERRORS.COMPANY_SLUG_REQUIRED })
    .max(50, { message: "Slug không được quá 50 ký tự" })
    .regex(/^[a-z0-9-]+$/, { message: "Slug chỉ được chứa chữ thường, số và dấu gạch ngang" }),
  description: z.string()
    .max(2000, { message: COMPANY_ERRORS.DESCRIPTION_TOO_LONG })
    .optional(),
  website: z.string()
    .url({ message: COMPANY_ERRORS.COMPANY_WEBSITE_INVALID })
    .optional()
    .or(z.literal("")),
  logo_url: z.string()
    .url({ message: "URL logo không hợp lệ" })
    .optional()
    .or(z.literal("")),
  industry: z.string()
    .max(100, { message: "Ngành nghề không được quá 100 ký tự" })
    .optional(),
  location: z.string()
    .max(100, { message: "Địa điểm không được quá 100 ký tự" })
    .optional(),
  email: z.string()
    .email({ message: COMPANY_ERRORS.COMPANY_EMAIL_INVALID })
    .optional()
    .or(z.literal("")),
});

// Update company schema
export const updateCompanySchema = z.object({
  id: z.string().uuid({ message: "Company ID không hợp lệ" }),
  name: z.string()
    .min(1, { message: COMPANY_ERRORS.COMPANY_NAME_REQUIRED })
    .max(100, { message: "Tên công ty không được quá 100 ký tự" })
    .optional(),
  description: z.string()
    .max(2000, { message: COMPANY_ERRORS.DESCRIPTION_TOO_LONG })
    .optional(),
  website: z.string()
    .url({ message: COMPANY_ERRORS.COMPANY_WEBSITE_INVALID })
    .optional()
    .or(z.literal("")),
  logo_url: z.string()
    .url({ message: "URL logo không hợp lệ" })
    .optional()
    .or(z.literal("")),
  industry: z.string()
    .max(100, { message: "Ngành nghề không được quá 100 ký tự" })
    .optional(),
  location: z.string()
    .max(100, { message: "Địa điểm không được quá 100 ký tự" })
    .optional(),
  email: z.string()
    .email({ message: COMPANY_ERRORS.COMPANY_EMAIL_INVALID })
    .optional()
    .or(z.literal("")),
});

// Upload company logo schema
export const uploadCompanyLogoSchema = z.object({
  company_id: z.string().uuid({ message: "Company ID không hợp lệ" }),
});

// Export input types
export type GetCompanyInput = z.infer<typeof getCompanySchema>;
export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type UploadCompanyLogoInput = z.infer<typeof uploadCompanyLogoSchema>; 