// Labels Constants for Job Board MVP
// Pattern: Domain mappings with Vietnamese labels

import type { 
  UserRole,
  ApplicationStatus,
  JobStatus,
  EmploymentType,
  ExperienceLevel,
  MessageStatus
} from "@/types/custom.types";

// Database enum mappings
export const USER_ROLES = {
  candidate: "Ứng viên",
  employer: "Nhà tuyển dụng", 
  admin: "Quản trị viên",
} as const;

export const APPLICATION_STATUSES = {
  submitted: "Đã nộp",
  reviewing: "Đang xem xét",
  interview: "Phỏng vấn",
  offer: "Nhận offer",
  rejected: "Bị từ chối",
  withdrawn: "Đã rút đơn",
} as const;

export const JOB_STATUSES = {
  draft: "Bản nháp",
  published: "Đã đăng",
  paused: "Tạm dừng",
  closed: "Đã đóng",
  expired: "Hết hạn",
} as const;

export const EMPLOYMENT_TYPES = {
  full_time: "Toàn thời gian",
  part_time: "Bán thời gian",
  contract: "Hợp đồng",
  internship: "Thực tập",
  freelance: "Freelance",
} as const;

export const EXPERIENCE_LEVELS = {
  entry: "Mới ra trường",
  junior: "Junior (1-2 năm)",
  mid: "Middle (3-5 năm)",
  senior: "Senior (5+ năm)",
  lead: "Team Lead",
  executive: "Giám đốc",
} as const;

export const MESSAGE_STATUSES = {
  sent: "Đã gửi",
  delivered: "Đã nhận",
  read: "Đã đọc",
} as const;

// UI Actions and Common Labels
export const UI = {
  // CRUD Actions
  create: "Tạo mới",
  edit: "Chỉnh sửa",
  update: "Cập nhật",
  delete: "Xóa",
  save: "Lưu",
  cancel: "Hủy",
  submit: "Gửi",
  reset: "Đặt lại",
  
  // Navigation
  back: "Quay lại",
  next: "Tiếp theo",
  previous: "Trước",
  continue: "Tiếp tục",
  finish: "Hoàn thành",
  
  // Status Actions
  publish: "Đăng",
  unpublish: "Bỏ đăng",
  approve: "Duyệt",
  reject: "Từ chối",
  activate: "Kích hoạt",
  deactivate: "Vô hiệu hóa",
  
  // Common Actions
  search: "Tìm kiếm",
  filter: "Lọc",
  sort: "Sắp xếp",
  upload: "Tải lên",
  download: "Tải xuống",
  view: "Xem",
  preview: "Xem trước",
  share: "Chia sẻ",
  copy: "Sao chép",
  
  // Job Actions
  apply: "Ứng tuyển",
  save_job: "Lưu việc",
  unsave_job: "Bỏ lưu",
  
  // Messages
  send: "Gửi",
  reply: "Trả lời",
  forward: "Chuyển tiếp",
  
  // Generic
  yes: "Có",
  no: "Không",
  ok: "Đồng ý",
  close: "Đóng",
  loading: "Đang tải...",
  refresh: "Làm mới",
} as const;

// Form Field Labels
export const FORM_LABELS = {
  // Authentication
  email: "Email",
  password: "Mật khẩu",
  confirm_password: "Xác nhận mật khẩu",
  full_name: "Họ và tên",
  remember_me: "Ghi nhớ đăng nhập",
  
  // User Profile
  phone: "Số điện thoại",
  avatar: "Ảnh đại diện",
  bio: "Giới thiệu",
  location: "Địa điểm",
  linkedin_url: "LinkedIn",
  portfolio_url: "Portfolio",
  
  // Company
  company_name: "Tên công ty",
  company_description: "Mô tả công ty",
  company_website: "Website công ty",
  company_logo: "Logo công ty",
  company_email: "Email công ty",
  company_industry: "Ngành nghề",
  company_size: "Quy mô công ty",
  
  // Job
  job_title: "Tiêu đề công việc",
  job_description: "Mô tả công việc",
  job_requirements: "Yêu cầu công việc",
  salary_min: "Mức lương tối thiểu",
  salary_max: "Mức lương tối đa",
  currency: "Đơn vị tiền tệ",
  employment_type: "Loại hình công việc",
  experience_level: "Mức kinh nghiệm",
  is_remote: "Làm việc từ xa",
  job_location: "Địa điểm làm việc",
  
  // Application
  cover_letter: "Thư xin việc",
  resume: "CV",
  application_notes: "Ghi chú",
  
  // CV
  cv_title: "Tiêu đề CV",
  cv_file: "File CV",
  is_primary: "CV chính",
  
  // Skills
  skill_name: "Tên kỹ năng",
  skill_category: "Danh mục kỹ năng",
  proficiency_level: "Mức độ thành thạo",
  years_experience: "Số năm kinh nghiệm",
  
  // Messages
  message_subject: "Tiêu đề",
  message_content: "Nội dung tin nhắn",
  recipient: "Người nhận",
  
  // Search & Filters
  keyword: "Từ khóa",
  category: "Danh mục",
  price_range: "Khoảng giá",
  date_range: "Khoảng thời gian",
  status: "Trạng thái",
} as const;

// Page Titles and Sections
export const PAGE_TITLES = {
  // Authentication
  login: "Đăng nhập",
  register: "Đăng ký",
  forgot_password: "Quên mật khẩu",
  
  // Main Pages
  home: "Trang chủ",
  jobs: "Việc làm",
  companies: "Công ty",
  about: "Về chúng tôi",
  contact: "Liên hệ",
  
  // User Dashboard
  dashboard: "Dashboard",
  profile: "Hồ sơ cá nhân",
  applications: "Đơn ứng tuyển",
  saved_jobs: "Việc làm đã lưu",
  messages: "Tin nhắn",
  settings: "Cài đặt",
  
  // Employer
  post_job: "Đăng tin tuyển dụng",
  manage_jobs: "Quản lý việc làm",
  candidates: "Ứng viên",
  company_profile: "Hồ sơ công ty",
  
  // Admin
  admin_dashboard: "Quản trị hệ thống",
  user_management: "Quản lý người dùng",
  job_moderation: "Kiểm duyệt việc làm",
  company_verification: "Xác minh công ty",
  analytics: "Phân tích",
} as const;

// Status Labels with Colors
export const STATUS_LABELS = {
  active: { label: "Hoạt động", color: "green" },
  inactive: { label: "Không hoạt động", color: "gray" },
  pending: { label: "Đang chờ", color: "yellow" },
  approved: { label: "Đã duyệt", color: "green" },
  rejected: { label: "Bị từ chối", color: "red" },
  verified: { label: "Đã xác minh", color: "blue" },
  unverified: { label: "Chưa xác minh", color: "gray" },
} as const;

// Notification Messages
export const NOTIFICATIONS = {
  // Success
  login_success: "Đăng nhập thành công",
  logout_success: "Đăng xuất thành công",
  profile_updated: "Cập nhật hồ sơ thành công",
  job_created: "Tạo việc làm thành công",
  company_created: "Tạo công ty thành công",
  company_updated: "Cập nhật công ty thành công",
  logo_uploaded: "Tải logo thành công",
  application_submitted: "Nộp đơn ứng tuyển thành công",
  message_sent: "Gửi tin nhắn thành công",
  
  // Info
  email_verification_sent: "Email xác thực đã được gửi",
  company_verification_pending: "Công ty đang chờ xác minh",
  
  // Warning
  incomplete_profile: "Hồ sơ chưa đầy đủ thông tin",
  session_expiring: "Phiên đăng nhập sắp hết hạn",
} as const;

// Time and Date Labels
export const TIME_LABELS = {
  just_now: "Vừa xong",
  minutes_ago: "phút trước",
  hours_ago: "giờ trước", 
  days_ago: "ngày trước",
  weeks_ago: "tuần trước",
  months_ago: "tháng trước",
  years_ago: "năm trước",
  
  today: "Hôm nay",
  yesterday: "Hôm qua",
  this_week: "Tuần này",
  last_week: "Tuần trước",
  this_month: "Tháng này",
  last_month: "Tháng trước",
} as const;

// Skill Categories
export const SKILL_CATEGORIES = {
  programming: "Lập trình",
  frontend: "Frontend",
  backend: "Backend",
  mobile: "Mobile",
  database: "Cơ sở dữ liệu",
  devops: "DevOps",
  cloud: "Cloud",
  design: "Thiết kế",
  marketing: "Marketing",
  business: "Kinh doanh",
  sales: "Bán hàng",
  finance: "Tài chính",
  hr: "Nhân sự",
  admin: "Hành chính",
  language: "Ngôn ngữ",
  other: "Khác",
} as const;

// Proficiency Levels
export const PROFICIENCY_LEVELS = {
  1: "Cơ bản",
  2: "Sơ cấp", 
  3: "Trung cấp",
  4: "Nâng cao",
  5: "Chuyên gia",
} as const;

// File Size Units
export const FILE_SIZE_UNITS = {
  bytes: "Bytes",
  kb: "KB",
  mb: "MB",
  gb: "GB",
} as const;

// Salary Ranges (in VND millions)
export const SALARY_RANGES = {
  "under-10": "Dưới 10 triệu",
  "10-15": "10-15 triệu",
  "15-20": "15-20 triệu", 
  "20-30": "20-30 triệu",
  "30-50": "30-50 triệu",
  "50-100": "50-100 triệu",
  "over-100": "Trên 100 triệu",
  negotiate: "Thỏa thuận",
} as const;

// Company Sizes
export const COMPANY_SIZES = {
  startup: "Startup (1-10 người)",
  small: "Nhỏ (11-50 người)",
  medium: "Vừa (51-200 người)",
  large: "Lớn (201-1000 người)",
  enterprise: "Tập đoàn (1000+ người)",
} as const;

// Type-safe helper functions
export type SkillCategory = keyof typeof SKILL_CATEGORIES;

// Helper functions for getting labels
export const getUserRoleLabel = (role: UserRole): string => {
  return USER_ROLES[role] || role;
};

export const getApplicationStatusLabel = (status: ApplicationStatus): string => {
  return APPLICATION_STATUSES[status] || status;
};

export const getJobStatusLabel = (status: JobStatus): string => {
  return JOB_STATUSES[status] || status;
};

export const getEmploymentTypeLabel = (type: EmploymentType): string => {
  return EMPLOYMENT_TYPES[type] || type;
};

export const getExperienceLevelLabel = (level: ExperienceLevel): string => {
  return EXPERIENCE_LEVELS[level] || level;
};

export const getMessageStatusLabel = (status: MessageStatus): string => {
  return MESSAGE_STATUSES[status] || status;
};

export const getSkillCategoryLabel = (category: SkillCategory): string => {
  return SKILL_CATEGORIES[category] || category;
};

export const getProficiencyLevelLabel = (level: number): string => {
  return PROFICIENCY_LEVELS[level as keyof typeof PROFICIENCY_LEVELS] || `Level ${level}`;
};

// Utility functions
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return `0 ${FILE_SIZE_UNITS.bytes}`;
  
  const k = 1024;
  const sizes = [FILE_SIZE_UNITS.bytes, FILE_SIZE_UNITS.kb, FILE_SIZE_UNITS.mb, FILE_SIZE_UNITS.gb];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatSalary(min?: number, max?: number, currency = "VND"): string {
  if (!min && !max) return SALARY_RANGES.negotiate;
  
  const formatNumber = (num: number) => {
    if (currency === "VND") {
      return `${(num / 1000000).toFixed(0)} triệu`;
    }
    return num.toLocaleString();
  };
  
  if (min && max) {
    return `${formatNumber(min)} - ${formatNumber(max)} ${currency}`;
  }
  
  if (min) {
    return `Từ ${formatNumber(min)} ${currency}`;
  }
  
  return `Lên đến ${formatNumber(max!)} ${currency}`;
}

export function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);
  
  if (diffInSeconds < 60) return TIME_LABELS.just_now;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} ${TIME_LABELS.minutes_ago}`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ${TIME_LABELS.hours_ago}`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ${TIME_LABELS.days_ago}`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} ${TIME_LABELS.weeks_ago}`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} ${TIME_LABELS.months_ago}`;
  
  return `${Math.floor(diffInSeconds / 31536000)} ${TIME_LABELS.years_ago}`;
}

export function createSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove Vietnamese diacritics
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Export all label categories for easy importing
export const ALL_LABELS = {
  USER_ROLES,
  APPLICATION_STATUSES,
  JOB_STATUSES,
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  MESSAGE_STATUSES,
  UI,
  FORM_LABELS,
  PAGE_TITLES,
  STATUS_LABELS,
  NOTIFICATIONS,
  TIME_LABELS,
  SKILL_CATEGORIES,
  PROFICIENCY_LEVELS,
  FILE_SIZE_UNITS,
  SALARY_RANGES,
  COMPANY_SIZES,
} as const;
