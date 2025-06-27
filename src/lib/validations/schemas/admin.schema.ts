import { z } from "zod";
import { paginationSchema } from "../common/pagination.schema";
import { uuidSchema } from "../common/id.schema";

// Get all users schema
export const getAllUsersSchema = paginationSchema.extend({
  role: z.enum(["candidate", "employer", "admin"]).optional(),
  search: z.string().max(100).optional(),
  is_active: z.boolean().optional(),
  sort_by: z.enum(["created_at", "updated_at", "full_name", "email"]).optional().default("created_at"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Deactivate user schema
export const deactivateUserSchema = z.object({
  user_id: uuidSchema,
  reason: z.string().max(500, "Lý do vô hiệu hóa không được quá 500 ký tự").optional(),
});

// Get all companies schema
export const getAllCompaniesSchema = paginationSchema.extend({
  search: z.string().max(100).optional(),
  verified: z.boolean().optional(),
  industry: z.string().optional(),
  sort_by: z.enum(["created_at", "updated_at", "name", "verified"]).optional().default("created_at"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Approve company schema
export const approveCompanySchema = z.object({
  company_id: uuidSchema,
  notes: z.string().max(500, "Ghi chú phê duyệt không được quá 500 ký tự").optional(),
});

// Get all jobs schema
export const getAllJobsSchema = paginationSchema.extend({
  search: z.string().max(100).optional(),
  status: z.enum(["draft", "published", "paused", "closed", "expired"]).optional(),
  company_id: uuidSchema.optional(),
  employment_type: z.enum(["full_time", "part_time", "contract", "internship", "freelance"]).optional(),
  sort_by: z.enum(["created_at", "updated_at", "published_at", "title", "application_count"]).optional().default("created_at"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Approve job schema
export const approveJobSchema = z.object({
  job_id: uuidSchema,
  notes: z.string().max(500, "Ghi chú phê duyệt không được quá 500 ký tự").optional(),
});

// Hide job schema
export const hideJobSchema = z.object({
  job_id: uuidSchema,
  reason: z.string().max(500, "Lý do ẩn việc làm không được quá 500 ký tự").optional(),
});

// Get industries schema
export const getIndustriesSchema = z.object({
  search: z.string().max(100).optional(),
  sort_by: z.enum(["name", "created_at"]).optional().default("name"),
  sort_order: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Get locations schema
export const getLocationsSchema = z.object({
  search: z.string().max(100).optional(),
  country: z.string().optional(),
  province: z.string().optional(),
  sort_by: z.enum(["name", "country", "province", "created_at"]).optional().default("name"),
  sort_order: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Get dashboard stats schema
export const getDashboardStatsSchema = z.object({
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  period: z.enum(["day", "week", "month", "year"]).optional().default("month"),
});

// Type exports
export type GetAllUsersInput = z.infer<typeof getAllUsersSchema>;
export type DeactivateUserInput = z.infer<typeof deactivateUserSchema>;
export type GetAllCompaniesInput = z.infer<typeof getAllCompaniesSchema>;
export type ApproveCompanyInput = z.infer<typeof approveCompanySchema>;
export type GetAllJobsInput = z.infer<typeof getAllJobsSchema>;
export type ApproveJobInput = z.infer<typeof approveJobSchema>;
export type HideJobInput = z.infer<typeof hideJobSchema>;
export type GetIndustriesInput = z.infer<typeof getIndustriesSchema>;
export type GetLocationsInput = z.infer<typeof getLocationsSchema>;
export type GetDashboardStatsInput = z.infer<typeof getDashboardStatsSchema>; 