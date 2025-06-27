// Authentication schemas
export * from "./auth.schema";
export {
  registerSchema,
  loginSchema,
  type RegisterInput,
  type LoginInput,
} from "./auth.schema";

// User management schemas
export * from "./user.schema";
export {
  updateProfileSchema,
  uploadAvatarSchema,
  updateRoleSchema,
  deactivateUserSchema,
  type UpdateProfileInput,
  type UploadAvatarInput,
  type UpdateRoleInput,
  type DeactivateUserInput,
} from "./user.schema";

// Job management schemas
export * from "./job.schema";
export {
  getJobsSchema,
  getJobDetailsSchema,
  searchJobsSchema,
  createJobSchema,
  updateJobSchema,
  deleteJobSchema,
  getCompanyJobsSchema,
  type GetJobsInput,
  type GetJobDetailsInput,
  type SearchJobsInput,
  type CreateJobInput,
  type UpdateJobInput,
  type DeleteJobInput,
  type GetCompanyJobsInput,
} from "./job.schema";

// Company management schemas
export * from "./company.schema";
export {
  getCompanySchema,
  createCompanySchema,
  updateCompanySchema,
  uploadCompanyLogoSchema,
  type GetCompanyInput,
  type CreateCompanyInput,
  type UpdateCompanyInput,
  type UploadCompanyLogoInput,
} from "./company.schema";

// Application schemas
export * from "./application.schema";

// CV schemas
export * from "./cv.schema";

// Skill schemas
export * from "./skill.schema";

// Saved jobs schemas
export * from "./saved-job.schema";

// Search schemas
export * from "./search.schema";

// Message schemas
export * from "./message.schema"; 