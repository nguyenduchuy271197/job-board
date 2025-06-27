import { z } from "zod";
import { SKILL_ERRORS } from "@/constants/error-messages";
import { uuidSchema } from "../common/id.schema";

// Schema for getting all skills
export const getSkillsSchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// Schema for getting user skills
export const getUserSkillsSchema = z.object({
  user_id: uuidSchema.optional(), // For viewing other users' skills
});

// Schema for individual user skill
export const userSkillSchema = z.object({
  skill_id: uuidSchema,
  proficiency_level: z
    .number()
    .min(1, SKILL_ERRORS.PROFICIENCY_LEVEL_INVALID)
    .max(5, SKILL_ERRORS.PROFICIENCY_LEVEL_INVALID),
  years_experience: z
    .number()
    .min(0, SKILL_ERRORS.YEARS_EXPERIENCE_INVALID)
    .max(50, SKILL_ERRORS.YEARS_EXPERIENCE_INVALID)
    .optional(),
});

// Schema for updating user skills (bulk update)
export const updateUserSkillsSchema = z.object({
  skills: z.array(userSkillSchema).min(0, "Danh sách kỹ năng không hợp lệ"),
});

// Schema for adding single user skill
export const addUserSkillSchema = z.object({
  skill_id: uuidSchema,
  proficiency_level: z
    .number()
    .min(1, SKILL_ERRORS.PROFICIENCY_LEVEL_INVALID)
    .max(5, SKILL_ERRORS.PROFICIENCY_LEVEL_INVALID),
  years_experience: z
    .number()
    .min(0, SKILL_ERRORS.YEARS_EXPERIENCE_INVALID)
    .max(50, SKILL_ERRORS.YEARS_EXPERIENCE_INVALID)
    .optional(),
});

// Schema for removing user skill
export const removeUserSkillSchema = z.object({
  skill_id: uuidSchema,
});

// Schema for creating new skill (for completeness)
export const createSkillSchema = z.object({
  name: z
    .string({
      required_error: SKILL_ERRORS.SKILL_NAME_REQUIRED,
    })
    .min(1, SKILL_ERRORS.SKILL_NAME_REQUIRED)
    .max(100, "Tên kỹ năng không được quá 100 ký tự"),
  category: z.string().optional(),
  description: z.string().max(500, "Mô tả không được quá 500 ký tự").optional(),
});

// Input types
export type GetSkillsInput = z.infer<typeof getSkillsSchema>;
export type GetUserSkillsInput = z.infer<typeof getUserSkillsSchema>;
export type UserSkillInput = z.infer<typeof userSkillSchema>;
export type UpdateUserSkillsInput = z.infer<typeof updateUserSkillsSchema>;
export type AddUserSkillInput = z.infer<typeof addUserSkillSchema>;
export type RemoveUserSkillInput = z.infer<typeof removeUserSkillSchema>;
export type CreateSkillInput = z.infer<typeof createSkillSchema>; 