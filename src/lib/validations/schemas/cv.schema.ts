import { z } from "zod";
import { CV_ERRORS } from "@/constants/error-messages";
import { uuidSchema } from "../common/id.schema";

// Schema for getting user CVs
export const getUserCVsSchema = z.object({
  user_id: uuidSchema.optional(), // For admins/employers viewing candidate CVs
});

// Schema for uploading CV (for server actions - uses FormData)
export const uploadCVSchema = z.object({
  title: z
    .string({
      required_error: CV_ERRORS.CV_TITLE_REQUIRED,
    })
    .min(1, CV_ERRORS.CV_TITLE_REQUIRED)
    .max(100, "Tiêu đề CV không được quá 100 ký tự"),
  is_primary: z.boolean().default(false),
});

// Schema for validating CV file upload (used in server action)
export const cvFileValidationSchema = z.object({
  file: z
    .instanceof(File, {
      message: CV_ERRORS.CV_FILE_REQUIRED,
    })
    .refine(
      (file) => file.size <= 10 * 1024 * 1024, // 10MB
      CV_ERRORS.CV_FILE_TOO_LARGE
    )
    .refine(
      (file) => {
        const allowedTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        return allowedTypes.includes(file.type);
      },
      CV_ERRORS.CV_FILE_INVALID_FORMAT
    ),
});

// Schema for deleting CV
export const deleteCVSchema = z.object({
  cv_id: uuidSchema,
});

// Schema for setting primary CV
export const setPrimaryCVSchema = z.object({
  cv_id: uuidSchema,
});

// Input types
export type GetUserCVsInput = z.infer<typeof getUserCVsSchema>;
export type UploadCVInput = z.infer<typeof uploadCVSchema>;
export type DeleteCVInput = z.infer<typeof deleteCVSchema>;
export type SetPrimaryCVInput = z.infer<typeof setPrimaryCVSchema>; 