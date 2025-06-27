import { z } from "zod";
import { APPLICATION_ERRORS } from "@/constants/error-messages";
import { uuidSchema } from "../common/id.schema";

// Schema for applying to a job
export const applyJobSchema = z.object({
  job_id: uuidSchema,
  cover_letter: z
    .string()
    .max(1000, APPLICATION_ERRORS.COVER_LETTER_TOO_LONG)
    .optional(),
  resume_url: z
    .string()
    .url("Resume URL không hợp lệ")
    .optional(),
  notes: z
    .string()
    .max(500, "Ghi chú không được quá 500 ký tự")
    .optional(),
});

// Schema for getting user applications with pagination and filters
export const getUserApplicationsSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(50).optional(),
  status: z.enum(["submitted", "reviewing", "interview", "offer", "rejected", "withdrawn"]).optional(),
  sort_by: z.enum(["applied_at", "updated_at", "status"]).optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
});

// Schema for getting job applications (for employers)
export const getJobApplicationsSchema = z.object({
  job_id: uuidSchema,
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(50).optional(),
  status: z.enum(["submitted", "reviewing", "interview", "offer", "rejected", "withdrawn"]).optional(),
  sort_by: z.enum(["applied_at", "updated_at", "status"]).optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
});

// Schema for updating application status
export const updateApplicationStatusSchema = z.object({
  application_id: uuidSchema,
  status: z.enum(["submitted", "reviewing", "interview", "offer", "rejected", "withdrawn"], {
    required_error: "Trạng thái ứng tuyển là bắt buộc",
    invalid_type_error: "Trạng thái ứng tuyển không hợp lệ",
  }),
  notes: z
    .string()
    .max(500, "Ghi chú không được quá 500 ký tự")
    .optional(),
});

// Schema for withdrawing application
export const withdrawApplicationSchema = z.object({
  application_id: uuidSchema,
  reason: z
    .string()
    .max(500, "Lý do rút đơn không được quá 500 ký tự")
    .optional(),
});

export type ApplyJobInput = z.infer<typeof applyJobSchema>;
export type GetUserApplicationsInput = z.infer<typeof getUserApplicationsSchema>;
export type GetJobApplicationsInput = z.infer<typeof getJobApplicationsSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
export type WithdrawApplicationInput = z.infer<typeof withdrawApplicationSchema>; 