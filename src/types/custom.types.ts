import { Database } from "./database.types";

export type Row<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertDto<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateDto<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];


// Core Job Board Types
export type User = Row<"users">;
export type UserInsertDto = InsertDto<"users">;
export type UserUpdateDto = UpdateDto<"users">;

// Extended User types with relations
export type UserWithSkills = User & {
  user_skills: (UserSkill & {
    skills: Skill;
  })[];
};

export type UserWithCVs = User & {
  cvs: CV[];
};

export type UserProfile = User & {
  user_skills?: (UserSkill & {
    skills: Skill;
  })[];
  cvs?: CV[];
  company_members?: (CompanyMember & {
    companies: Company;
  })[];
};

// Candidate search types
export type CandidateSearchResult = User & {
  user_skills: (UserSkill & {
    skills: Skill;
  })[];
  cvs: CV[];
  _relevance_score?: number;
};

export type CandidateSearchParams = {
  query?: string;
  page?: number;
  limit?: number;
  sort_by?: "relevance" | "created_at" | "updated_at" | "experience";
  sort_order?: "asc" | "desc";
  location?: string;
  experience_level?: ExperienceLevel;
  min_years_experience?: number;
  max_years_experience?: number;
  skills?: string[];
  required_skills?: string[];
  min_skill_level?: number;
  employment_types?: EmploymentType[];
  is_available?: boolean;
  min_salary?: number;
  max_salary?: number;
  has_cv?: boolean;
  has_portfolio?: boolean;
  verified_only?: boolean;
};

// Alias for component compatibility
export type SearchCandidatesInput = CandidateSearchParams;

export type CandidateSearchResponse = {
  candidates: CandidateSearchResult[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_previous: boolean;
};

export type Job = Row<"jobs">;
export type JobInsertDto = InsertDto<"jobs">;
export type JobUpdateDto = UpdateDto<"jobs">;

// Extended Job types with relations
export type JobWithCompany = Job & {
  companies: Company;
};

export type JobWithSkills = Job & {
  job_skills: (JobSkill & {
    skills: Skill;
  })[];
};

export type JobWithCompanyAndSkills = Job & {
  companies: Company;
  job_skills: (JobSkill & {
    skills: Skill;
  })[];
};

export type JobDetails = Job & {
  companies: Company;
  job_skills: (JobSkill & {
    skills: Skill;
  })[];
  applications_count?: number;
  is_saved?: boolean;
  has_applied?: boolean;
};

// Job search filters and pagination
export type JobSearchFilters = {
  query?: string;
  location?: string;
  employment_type?: EmploymentType;
  experience_level?: ExperienceLevel;
  salary_min?: number;
  salary_max?: number;
  skills?: string[];
  company_id?: string;
  is_remote?: boolean;
};

export type JobSearchParams = JobSearchFilters & {
  page?: number;
  limit?: number;
  sort_by?: "created_at" | "published_at" | "application_count" | "salary_min";
  sort_order?: "asc" | "desc";
};

export type JobSearchResult = {
  jobs: JobWithCompanyAndSkills[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_previous: boolean;
};

export type Company = Row<"companies">;
export type CompanyInsertDto = InsertDto<"companies">;
export type CompanyUpdateDto = UpdateDto<"companies">;

export type CompanyMember = Row<"company_members">;
export type CompanyMemberInsertDto = InsertDto<"company_members">;
export type CompanyMemberUpdateDto = UpdateDto<"company_members">;

export type Application = Row<"applications">;
export type ApplicationInsertDto = InsertDto<"applications">;
export type ApplicationUpdateDto = UpdateDto<"applications">;

export type CV = Row<"cvs">;
export type CVInsertDto = InsertDto<"cvs">;
export type CVUpdateDto = UpdateDto<"cvs">;

export type Skill = Row<"skills">;
export type SkillInsertDto = InsertDto<"skills">;
export type SkillUpdateDto = UpdateDto<"skills">;

export type UserSkill = Row<"user_skills">;
export type UserSkillInsertDto = InsertDto<"user_skills">;
export type UserSkillUpdateDto = UpdateDto<"user_skills">;

export type JobSkill = Row<"job_skills">;
export type JobSkillInsertDto = InsertDto<"job_skills">;
export type JobSkillUpdateDto = UpdateDto<"job_skills">;

export type Message = Row<"messages">;
export type MessageInsertDto = InsertDto<"messages">;
export type MessageUpdateDto = UpdateDto<"messages">;

// Extended Message types with relations
export type MessageWithUsers = Message & {
  sender: User;
  recipient: User;
};

export type MessageWithApplication = Message & {
  sender: User;
  recipient: User;
  applications?: ApplicationWithJob;
};

export type ConversationMessage = Message & {
  sender: User;
  recipient: User;
};

export type SavedJob = Row<"saved_jobs">;
export type SavedJobInsertDto = InsertDto<"saved_jobs">;
export type SavedJobUpdateDto = UpdateDto<"saved_jobs">;

// Extended SavedJob types with relations
export type SavedJobWithDetails = SavedJob & {
  jobs: JobWithCompanyAndSkills;
};

export type SavedJobsResult = {
  saved_jobs: SavedJobWithDetails[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_previous: boolean;
};

export type Industry = Row<"industries">;
export type IndustryInsertDto = InsertDto<"industries">;
export type IndustryUpdateDto = UpdateDto<"industries">;

export type Location = Row<"locations">;
export type LocationInsertDto = InsertDto<"locations">;
export type LocationUpdateDto = UpdateDto<"locations">;


export type UserRole = Database["public"]["Enums"]["user_role"];
export type JobStatus = Database["public"]["Enums"]["job_status"];
export type ApplicationStatus = Database["public"]["Enums"]["application_status"];
export type MessageStatus = Database["public"]["Enums"]["message_status"];
export type EmploymentType = Database["public"]["Enums"]["employment_type"];
export type ExperienceLevel = Database["public"]["Enums"]["experience_level"];

// Extended Company types with relations
export type CompanyWithMembers = Company & {
  company_members: (CompanyMember & {
    users: User;
  })[];
};

export type CompanyWithJobs = Company & {
  jobs: Job[];
};

export type CompanyWithJobsAndMembers = Company & {
  jobs: Job[];
  company_members: (CompanyMember & {
    users: User;
  })[];
};

export type CompanyDetails = Company & {
  jobs?: Job[];
  company_members?: (CompanyMember & {
    users: User;
  })[];
  jobs_count?: number;
  active_jobs_count?: number;
};

// Extended Application types with relations
export type ApplicationWithJob = Application & {
  jobs: JobWithCompany;
};

export type ApplicationWithCandidate = Application & {
  users: User;
};

export type ApplicationWithJobAndCandidate = Application & {
  jobs: JobWithCompany;
  users: User;
};

export type ApplicationDetails = Application & {
  jobs?: JobWithCompany;
  users?: User;
  messages?: Message[];
};

export type ApplicationWithUserAndCV = Application & {
  users: User & {
    user_skills: (UserSkill & {
      skills: Skill;
    })[];
  };
  cvs?: CV;
  jobs: Job & {
    companies: Company;
  };
};

// Application search filters and pagination
export type ApplicationFilters = {
  job_id?: string;
  candidate_id?: string;
  status?: ApplicationStatus;
  company_id?: string;
  date_from?: string;
  date_to?: string;
};

export type ApplicationSearchParams = ApplicationFilters & {
  page?: number;
  limit?: number;
  sort_by?: "applied_at" | "updated_at" | "status";
  sort_order?: "asc" | "desc";
};

export type ApplicationSearchResult = {
  applications: ApplicationWithJobAndCandidate[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_previous: boolean;
};

// Admin types
export type AdminUserSearchResult = {
  users: User[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_previous: boolean;
};

export type AdminCompanySearchResult = {
  companies: CompanyDetails[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_previous: boolean;
};

export type AdminJobSearchResult = {
  jobs: JobWithCompanyAndSkills[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_previous: boolean;
};

export type DashboardStats = {
  users: {
    total: number;
    active: number;
    candidates: number;
    employers: number;
    new_this_month: number;
  };
  companies: {
    total: number;
    verified: number;
    pending_verification: number;
    new_this_month: number;
  };
  jobs: {
    total: number;
    published: number;
    draft: number;
    closed: number;
    new_this_month: number;
  };
  applications: {
    total: number;
    submitted: number;
    reviewing: number;
    interviews: number;
    offers: number;
    new_this_month: number;
  };
  growth_data: {
    date: string;
    users: number;
    jobs: number;
    applications: number;
  }[];
};
