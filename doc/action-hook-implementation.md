# Job Board MVP - Essential Actions & Hooks Implementation

Kế hoạch triển khai tối thiểu phù hợp với các yêu cầu trong PRD (FR01-FR20).

---

## 🔐 **Authentication & Users** (FR01-FR03)

| Feature        | Action                                          | Hook                          | Type     | Priority |
| -------------- | ----------------------------------------------- | ----------------------------- | -------- | -------- |
| Register       | `auth/register.ts` → `registerUser`             | `auth/use-register.ts`        | Mutation | Cao      |
| Login          | `auth/login.ts` → `loginUser`                   | `auth/use-login.ts`           | Mutation | Cao      |
| Logout         | `auth/logout.ts` → `logoutUser`                 | `auth/use-logout.ts`          | Mutation | Cao      |
| Get Profile    | `users/get-profile.ts` → `getUserProfile`       | `users/use-profile.ts`        | Query    | Cao      |
| Update Profile | `users/update-profile.ts` → `updateUserProfile` | `users/use-update-profile.ts` | Mutation | Cao      |

---

## 💼 **Jobs Management** (FR04-FR06, FR12)

| Feature          | Action                                        | Hook                       | Type     | Priority |
| ---------------- | --------------------------------------------- | -------------------------- | -------- | -------- |
| Get Jobs         | `jobs/get-jobs.ts` → `getJobs`                | `jobs/use-jobs.ts`         | Query    | Cao      |
| Get Job Details  | `jobs/get-job.ts` → `getJobDetails`           | `jobs/use-job.ts`          | Query    | Cao      |
| Search Jobs      | `jobs/search-jobs.ts` → `searchJobs`          | `jobs/use-search-jobs.ts`  | Query    | Cao      |
| Create Job       | `jobs/create-job.ts` → `createJob`            | `jobs/use-create-job.ts`   | Mutation | Cao      |
| Update Job       | `jobs/update-job.ts` → `updateJob`            | `jobs/use-update-job.ts`   | Mutation | Cao      |
| Delete Job       | `jobs/delete-job.ts` → `deleteJob`            | `jobs/use-delete-job.ts`   | Mutation | Cao      |
| Get Company Jobs | `jobs/get-company-jobs.ts` → `getCompanyJobs` | `jobs/use-company-jobs.ts` | Query    | Cao      |

---

## 🏢 **Companies Management** (FR11)

| Feature             | Action                                           | Hook                              | Type     | Priority |
| ------------------- | ------------------------------------------------ | --------------------------------- | -------- | -------- |
| Get Company Details | `companies/get-company.ts` → `getCompanyDetails` | `companies/use-company.ts`        | Query    | Cao      |
| Create Company      | `companies/create-company.ts` → `createCompany`  | `companies/use-create-company.ts` | Mutation | Cao      |
| Update Company      | `companies/update-company.ts` → `updateCompany`  | `companies/use-update-company.ts` | Mutation | Cao      |

---

## 📝 **Applications Management** (FR08-FR09, FR13)

| Feature                   | Action                                                          | Hook                                    | Type     | Priority |
| ------------------------- | --------------------------------------------------------------- | --------------------------------------- | -------- | -------- |
| Apply for Job             | `applications/apply-job.ts` → `applyForJob`                     | `applications/use-apply-job.ts`         | Mutation | Cao      |
| Get User Applications     | `applications/get-user-applications.ts` → `getUserApplications` | `applications/use-user-applications.ts` | Query    | Cao      |
| Get Job Applications      | `applications/get-job-applications.ts` → `getJobApplications`   | `applications/use-job-applications.ts`  | Query    | Cao      |
| Update Application Status | `applications/update-status.ts` → `updateApplicationStatus`     | `applications/use-update-status.ts`     | Mutation | Cao      |

---

## 📄 **CV & Skills Management** (FR07)

| Feature            | Action                                              | Hook                               | Type     | Priority |
| ------------------ | --------------------------------------------------- | ---------------------------------- | -------- | -------- |
| Get User CVs       | `cvs/get-user-cvs.ts` → `getUserCVs`                | `cvs/use-user-cvs.ts`              | Query    | Cao      |
| Upload CV          | `cvs/upload-cv.ts` → `uploadCV`                     | `cvs/use-upload-cv.ts`             | Mutation | Cao      |
| Delete CV          | `cvs/delete-cv.ts` → `deleteCV`                     | `cvs/use-delete-cv.ts`             | Mutation | Cao      |
| Get Skills         | `skills/get-skills.ts` → `getSkills`                | `skills/use-skills.ts`             | Query    | Cao      |
| Get User Skills    | `skills/get-user-skills.ts` → `getUserSkills`       | `skills/use-user-skills.ts`        | Query    | Cao      |
| Update User Skills | `skills/update-user-skills.ts` → `updateUserSkills` | `skills/use-update-user-skills.ts` | Mutation | Cao      |

---

## ⭐ **Saved Jobs** (FR10)

| Feature        | Action                                          | Hook                           | Type     | Priority   |
| -------------- | ----------------------------------------------- | ------------------------------ | -------- | ---------- |
| Get Saved Jobs | `saved-jobs/get-saved-jobs.ts` → `getSavedJobs` | `saved-jobs/use-saved-jobs.ts` | Query    | Trung bình |
| Save Job       | `saved-jobs/save-job.ts` → `saveJob`            | `saved-jobs/use-save-job.ts`   | Mutation | Trung bình |
| Unsave Job     | `saved-jobs/unsave-job.ts` → `unsaveJob`        | `saved-jobs/use-unsave-job.ts` | Mutation | Trung bình |

---

## 🔍 **Candidate Search** (FR14)

| Feature           | Action                                             | Hook                              | Type  | Priority   |
| ----------------- | -------------------------------------------------- | --------------------------------- | ----- | ---------- |
| Search Candidates | `search/search-candidates.ts` → `searchCandidates` | `search/use-search-candidates.ts` | Query | Trung bình |

---

## 💬 **Messages** (FR15)

| Feature      | Action                                     | Hook                           | Type     | Priority   |
| ------------ | ------------------------------------------ | ------------------------------ | -------- | ---------- |
| Get Messages | `messages/get-messages.ts` → `getMessages` | `messages/use-messages.ts`     | Query    | Trung bình |
| Send Message | `messages/send-message.ts` → `sendMessage` | `messages/use-send-message.ts` | Mutation | Trung bình |

---

## 👑 **Admin Management** (FR16-FR20)

| Feature             | Action                                                  | Hook                                  | Type     | Priority   |
| ------------------- | ------------------------------------------------------- | ------------------------------------- | -------- | ---------- |
| Get All Users       | `admin/users/get-users.ts` → `getAllUsers`              | `admin/users/use-users.ts`            | Query    | Cao        |
| Deactivate User     | `admin/users/deactivate-user.ts` → `deactivateUser`     | `admin/users/use-deactivate-user.ts`  | Mutation | Cao        |
| Get All Companies   | `admin/companies/get-companies.ts` → `getAllCompanies`  | `admin/companies/use-companies.ts`    | Query    | Cao        |
| Approve Company     | `admin/companies/approve-company.ts` → `approveCompany` | `admin/companies/use-approve.ts`      | Mutation | Cao        |
| Get All Jobs        | `admin/jobs/get-jobs.ts` → `getAllJobs`                 | `admin/jobs/use-jobs.ts`              | Query    | Cao        |
| Approve Job         | `admin/jobs/approve-job.ts` → `approveJob`              | `admin/jobs/use-approve.ts`           | Mutation | Cao        |
| Hide Job            | `admin/jobs/hide-job.ts` → `hideJob`                    | `admin/jobs/use-hide.ts`              | Mutation | Cao        |
| Get Industries      | `admin/master-data/get-industries.ts` → `getIndustries` | `admin/master-data/use-industries.ts` | Query    | Trung bình |
| Get Locations       | `admin/master-data/get-locations.ts` → `getLocations`   | `admin/master-data/use-locations.ts`  | Query    | Trung bình |
| Get Dashboard Stats | `admin/dashboard/get-stats.ts` → `getDashboardStats`    | `admin/dashboard/use-stats.ts`        | Query    | Trung bình |

## 📁 **Complete File Structure**

```
src/
├── actions/
│   ├── auth/
│   │   ├── register.ts
│   │   ├── login.ts
│   │   ├── logout.ts
│   │   └── validations/
│   │       ├── register-schema.ts
│   │       ├── login-schema.ts
│   │       └── index.ts
│   ├── users/
│   │   ├── get-profile.ts
│   │   ├── update-profile.ts
│   │   └── validations/
│   │       ├── update-profile-schema.ts
│   │       └── index.ts
│   ├── jobs/
│   │   ├── get-jobs.ts
│   │   ├── get-job.ts
│   │   ├── search-jobs.ts
│   │   ├── create-job.ts
│   │   ├── update-job.ts
│   │   ├── delete-job.ts
│   │   ├── get-company-jobs.ts
│   │   └── validations/
│   │       ├── create-job-schema.ts
│   │       ├── update-job-schema.ts
│   │       ├── search-jobs-schema.ts
│   │       └── index.ts
│   ├── companies/
│   │   ├── get-company.ts
│   │   ├── create-company.ts
│   │   ├── update-company.ts
│   │   └── validations/
│   │       ├── create-company-schema.ts
│   │       ├── update-company-schema.ts
│   │       └── index.ts
│   ├── applications/
│   │   ├── apply-job.ts
│   │   ├── get-user-applications.ts
│   │   ├── get-job-applications.ts
│   │   ├── update-status.ts
│   │   └── validations/
│   │       ├── apply-job-schema.ts
│   │       ├── update-status-schema.ts
│   │       └── index.ts
│   ├── cvs/
│   │   ├── get-user-cvs.ts
│   │   ├── upload-cv.ts
│   │   ├── delete-cv.ts
│   │   └── validations/
│   │       ├── upload-cv-schema.ts
│   │       └── index.ts
│   ├── skills/
│   │   ├── get-skills.ts
│   │   ├── get-user-skills.ts
│   │   ├── update-user-skills.ts
│   │   └── validations/
│   │       ├── update-user-skills-schema.ts
│   │       └── index.ts
│   ├── saved-jobs/
│   │   ├── get-saved-jobs.ts
│   │   ├── save-job.ts
│   │   ├── unsave-job.ts
│   │   └── validations/
│   │       ├── save-job-schema.ts
│   │       └── index.ts
│   ├── search/
│   │   ├── search-candidates.ts
│   │   └── validations/
│   │       ├── search-candidates-schema.ts
│   │       └── index.ts
│   ├── messages/
│   │   ├── get-messages.ts
│   │   ├── send-message.ts
│   │   └── validations/
│   │       ├── send-message-schema.ts
│   │       └── index.ts
│   └── admin/
│       ├── users/
│       │   ├── get-users.ts
│       │   ├── deactivate-user.ts
│       │   └── validations/
│       │       ├── deactivate-user-schema.ts
│       │       └── index.ts
│       ├── companies/
│       │   ├── get-companies.ts
│       │   ├── approve-company.ts
│       │   └── validations/
│       │       ├── approve-company-schema.ts
│       │       └── index.ts
│       ├── jobs/
│       │   ├── get-jobs.ts
│       │   ├── approve-job.ts
│       │   ├── hide-job.ts
│       │   └── validations/
│       │       ├── approve-job-schema.ts
│       │       ├── hide-job-schema.ts
│       │       └── index.ts
│       ├── master-data/
│       │   ├── get-industries.ts
│       │   ├── get-locations.ts
│       │   └── validations/
│       │       └── index.ts
│       └── dashboard/
│           ├── get-stats.ts
│           └── validations/
│               └── index.ts
├── hooks/
│   ├── auth/
│   │   ├── use-register.ts
│   │   ├── use-login.ts
│   │   └── use-logout.ts
│   ├── users/
│   │   ├── use-profile.ts
│   │   └── use-update-profile.ts
│   ├── jobs/
│   │   ├── use-jobs.ts
│   │   ├── use-job.ts
│   │   ├── use-search-jobs.ts
│   │   ├── use-create-job.ts
│   │   ├── use-update-job.ts
│   │   ├── use-delete-job.ts
│   │   └── use-company-jobs.ts
│   ├── companies/
│   │   ├── use-company.ts
│   │   ├── use-create-company.ts
│   │   └── use-update-company.ts
│   ├── applications/
│   │   ├── use-apply-job.ts
│   │   ├── use-user-applications.ts
│   │   ├── use-job-applications.ts
│   │   └── use-update-status.ts
│   ├── cvs/
│   │   ├── use-user-cvs.ts
│   │   ├── use-upload-cv.ts
│   │   └── use-delete-cv.ts
│   ├── skills/
│   │   ├── use-skills.ts
│   │   ├── use-user-skills.ts
│   │   └── use-update-user-skills.ts
│   ├── saved-jobs/
│   │   ├── use-saved-jobs.ts
│   │   ├── use-save-job.ts
│   │   └── use-unsave-job.ts
│   ├── search/
│   │   └── use-search-candidates.ts
│   ├── messages/
│   │   ├── use-messages.ts
│   │   └── use-send-message.ts
│   └── admin/
│       ├── users/
│       │   ├── use-users.ts
│       │   └── use-deactivate-user.ts
│       ├── companies/
│       │   ├── use-companies.ts
│       │   └── use-approve.ts
│       ├── jobs/
│       │   ├── use-jobs.ts
│       │   ├── use-approve.ts
│       │   └── use-hide.ts
│       ├── master-data/
│       │   ├── use-industries.ts
│       │   └── use-locations.ts
│       └── dashboard/
│           └── use-stats.ts
└── lib/
    └── validations/
        ├── common/
        │   ├── pagination.schema.ts      # Zod schema cho phân trang
        │   ├── id.schema.ts              # Zod schema cho ID validation
        │   ├── search.schema.ts          # Zod schema cho tìm kiếm
        │   └── index.ts                  # Export tất cả common schemas
        └── schemas/
            ├── auth.schema.ts            # Zod schemas cho authentication
            ├── user.schema.ts            # Zod schemas cho user operations
            ├── job.schema.ts             # Zod schemas cho job operations
            ├── company.schema.ts         # Zod schemas cho company operations
            ├── application.schema.ts     # Zod schemas cho application operations
            ├── cv.schema.ts              # Zod schemas cho CV operations
            ├── skill.schema.ts           # Zod schemas cho skill operations
            ├── message.schema.ts         # Zod schemas cho message operations
            ├── admin.schema.ts           # Zod schemas cho admin operations
            └── index.ts                  # Export tất cả schemas
```
