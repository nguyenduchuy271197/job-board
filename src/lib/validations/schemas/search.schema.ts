import { z } from "zod";

// Search candidates validation
export const searchCandidatesSchema = z.object({
  query: z.string().min(1).optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(50).optional().default(10),
  sort_by: z.enum(["relevance", "created_at", "updated_at", "experience"]).optional().default("relevance"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
  
  // Location filters
  location: z.string().min(1).optional(),
  
  // Experience filters
  experience_level: z.enum(["entry", "junior", "mid", "senior", "lead", "executive"]).optional(),
  min_years_experience: z.number().int().min(0).max(50).optional(),
  max_years_experience: z.number().int().min(0).max(50).optional(),
  
  // Skills filters
  skills: z.array(z.string().uuid()).optional(),
  required_skills: z.array(z.string().uuid()).optional(),
  min_skill_level: z.number().int().min(1).max(5).optional(),
  
  // Employment preferences
  employment_types: z.array(z.enum(["full_time", "part_time", "contract", "internship", "freelance"])).optional(),
  is_available: z.boolean().optional(),
  
  // Salary expectations
  min_salary: z.number().int().positive().optional(),
  max_salary: z.number().int().positive().optional(),
  
  // Profile filters
  has_cv: z.boolean().optional(),
  has_portfolio: z.boolean().optional(),
  verified_only: z.boolean().optional().default(false),
}).refine((data) => {
  // Ensure min_years_experience is not greater than max_years_experience
  if (data.min_years_experience && data.max_years_experience) {
    return data.min_years_experience <= data.max_years_experience;
  }
  return true;
}, {
  message: "Số năm kinh nghiệm tối thiểu không được lớn hơn số năm kinh nghiệm tối đa",
  path: ["min_years_experience"]
}).refine((data) => {
  // Ensure min_salary is not greater than max_salary
  if (data.min_salary && data.max_salary) {
    return data.min_salary <= data.max_salary;
  }
  return true;
}, {
  message: "Mức lương tối thiểu không được lớn hơn mức lương tối đa",
  path: ["min_salary"]
});

export type SearchCandidatesInput = z.infer<typeof searchCandidatesSchema>; 