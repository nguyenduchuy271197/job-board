import { z } from "zod";
import { uuidSchema } from "../common";

// Get saved jobs validation
export const getSavedJobsSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(10),
  sort_by: z.enum(["created_at", "job_title", "company_name"]).optional().default("created_at"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  employment_type: z.enum(["full_time", "part_time", "contract", "internship", "freelance"]).optional(),
  experience_level: z.enum(["entry", "junior", "mid", "senior", "lead", "executive"]).optional(),
  salary_min: z.number().int().positive().optional(),
  salary_max: z.number().int().positive().optional(),
});

export type GetSavedJobsInput = z.infer<typeof getSavedJobsSchema>;

// Save job validation
export const saveJobSchema = z.object({
  job_id: uuidSchema,
});

export type SaveJobInput = z.infer<typeof saveJobSchema>;

// Unsave job validation
export const unsaveJobSchema = z.object({
  job_id: uuidSchema,
});

export type UnsaveJobInput = z.infer<typeof unsaveJobSchema>; 