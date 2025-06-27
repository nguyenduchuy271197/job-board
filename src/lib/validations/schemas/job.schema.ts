import { z } from "zod";
import { JOB_ERRORS } from "@/constants/error-messages";

// Get jobs schema
export const getJobsSchema = z.object({
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(20),
  company_id: z.string().uuid().optional(),
  status: z.enum(["draft", "published", "paused", "closed", "expired"]).optional(),
});

// Get job details schema
export const getJobDetailsSchema = z.object({
  id: z.string().uuid({ message: "Job ID không hợp lệ" }),
});

// Search jobs schema
export const searchJobsSchema = z.object({
  query: z.string().max(200).optional(),
  location: z.string().max(100).optional(),
  employment_type: z.enum(["full_time", "part_time", "contract", "internship", "freelance"]).optional(),
  experience_level: z.enum(["entry", "junior", "mid", "senior", "lead", "executive"]).optional(),
  salary_min: z.number().min(0).optional(),
  salary_max: z.number().min(0).optional(),
  skills: z.array(z.string().uuid()).optional(),
  company_id: z.string().uuid().optional(),
  is_remote: z.boolean().optional(),
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(50).optional().default(20),
  sort_by: z.enum(["created_at", "published_at", "application_count", "salary_min"]).optional().default("published_at"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Create job schema
export const createJobSchema = z.object({
  title: z
    .string({ required_error: JOB_ERRORS.JOB_TITLE_REQUIRED })
    .min(1, { message: JOB_ERRORS.JOB_TITLE_REQUIRED })
    .max(200, { message: "Tiêu đề việc làm không được quá 200 ký tự" }),
  description: z
    .string({ required_error: JOB_ERRORS.JOB_DESCRIPTION_REQUIRED })
    .min(1, { message: JOB_ERRORS.JOB_DESCRIPTION_REQUIRED })
    .max(10000, { message: "Mô tả việc làm không được quá 10,000 ký tự" }),
  requirements: z
    .string()
    .max(5000, { message: "Yêu cầu công việc không được quá 5,000 ký tự" })
    .optional(),
  salary_min: z
    .number()
    .min(0, { message: "Mức lương tối thiểu phải lớn hơn 0" })
    .optional(),
  salary_max: z
    .number()
    .min(0, { message: "Mức lương tối đa phải lớn hơn 0" })
    .optional(),
  currency: z
    .string()
    .optional()
    .default("VND"),
  employment_type: z
    .enum(["full_time", "part_time", "contract", "internship", "freelance"], {
      required_error: "Loại hình công việc là bắt buộc",
      invalid_type_error: JOB_ERRORS.EMPLOYMENT_TYPE_INVALID,
    })
    .default("full_time"),
  experience_level: z
    .enum(["entry", "junior", "mid", "senior", "lead", "executive"], {
      required_error: "Mức kinh nghiệm là bắt buộc",
      invalid_type_error: JOB_ERRORS.EXPERIENCE_LEVEL_INVALID,
    })
    .default("junior"),
  location: z
    .string()
    .max(200, { message: "Địa điểm không được quá 200 ký tự" })
    .optional(),
  is_remote: z
    .boolean()
    .optional()
    .default(false),
  company_id: z
    .string()
    .uuid({ message: "Company ID không hợp lệ" }),
  skills: z
    .array(z.string().uuid({ message: "Skill ID không hợp lệ" }))
    .optional()
    .default([]),
}).refine(data => {
  if (data.salary_min && data.salary_max) {
    return data.salary_min <= data.salary_max;
  }
  return true;
}, {
  message: JOB_ERRORS.SALARY_RANGE_INVALID,
  path: ["salary_max"],
});

// Update job schema
export const updateJobSchema = z.object({
  id: z.string().uuid({ message: "Job ID không hợp lệ" }),
  title: z
    .string()
    .min(1, { message: JOB_ERRORS.JOB_TITLE_REQUIRED })
    .max(200, { message: "Tiêu đề việc làm không được quá 200 ký tự" })
    .optional(),
  description: z
    .string()
    .min(1, { message: JOB_ERRORS.JOB_DESCRIPTION_REQUIRED })
    .max(10000, { message: "Mô tả việc làm không được quá 10,000 ký tự" })
    .optional(),
  requirements: z
    .string()
    .max(5000, { message: "Yêu cầu công việc không được quá 5,000 ký tự" })
    .optional(),
  salary_min: z
    .number()
    .min(0, { message: "Mức lương tối thiểu phải lớn hơn 0" })
    .optional(),
  salary_max: z
    .number()
    .min(0, { message: "Mức lương tối đa phải lớn hơn 0" })
    .optional(),
  currency: z.string().optional(),
  employment_type: z
    .enum(["full_time", "part_time", "contract", "internship", "freelance"], {
      invalid_type_error: JOB_ERRORS.EMPLOYMENT_TYPE_INVALID,
    })
    .optional(),
  experience_level: z
    .enum(["entry", "junior", "mid", "senior", "lead", "executive"], {
      invalid_type_error: JOB_ERRORS.EXPERIENCE_LEVEL_INVALID,
    })
    .optional(),
  location: z
    .string()
    .max(200, { message: "Địa điểm không được quá 200 ký tự" })
    .optional(),
  is_remote: z.boolean().optional(),
  status: z
    .enum(["draft", "published", "paused", "closed", "expired"])
    .optional(),
  skills: z
    .array(z.string().uuid({ message: "Skill ID không hợp lệ" }))
    .optional(),
}).refine(data => {
  if (data.salary_min && data.salary_max) {
    return data.salary_min <= data.salary_max;
  }
  return true;
}, {
  message: JOB_ERRORS.SALARY_RANGE_INVALID,
  path: ["salary_max"],
});

// Delete job schema
export const deleteJobSchema = z.object({
  id: z.string().uuid({ message: "Job ID không hợp lệ" }),
});

// Get company jobs schema
export const getCompanyJobsSchema = z.object({
  company_id: z.string().uuid({ message: "Company ID không hợp lệ" }),
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(20),
  status: z.enum(["draft", "published", "paused", "closed", "expired"]).optional(),
});

// Type exports
export type GetJobsInput = z.infer<typeof getJobsSchema>;
export type GetJobDetailsInput = z.infer<typeof getJobDetailsSchema>;
export type SearchJobsInput = z.infer<typeof searchJobsSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type DeleteJobInput = z.infer<typeof deleteJobSchema>;
export type GetCompanyJobsInput = z.infer<typeof getCompanyJobsSchema>; 