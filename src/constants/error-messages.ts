// Error Messages Constants for Job Board MVP
// Pattern: <DOMAIN>_ERRORS with Vietnamese messages

export const GENERIC_ERRORS = {
  SOMETHING_WENT_WRONG: "Đã có lỗi xảy ra, vui lòng thử lại",
  NETWORK_ERROR: "Lỗi kết nối mạng",
  UNAUTHORIZED: "Bạn không có quyền truy cập",
  FORBIDDEN: "Bạn không được phép thực hiện hành động này",
  NOT_FOUND: "Không tìm thấy tài nguyên",
  VALIDATION_ERROR: "Dữ liệu không hợp lệ",
  SERVER_ERROR: "Lỗi máy chủ nội bộ",
} as const;

export const AUTH_ERRORS = {
  // Login/Register
  LOGIN_FAILED: "Đăng nhập thất bại",
  INVALID_CREDENTIALS: "Email hoặc mật khẩu không đúng",
  EMAIL_ALREADY_EXISTS: "Email đã được sử dụng",
  WEAK_PASSWORD: "Mật khẩu phải có ít nhất 8 ký tự",
  PASSWORD_MISMATCH: "Mật khẩu xác nhận không khớp",
  
  // Validation
  EMAIL_REQUIRED: "Email là bắt buộc",
  EMAIL_INVALID: "Email không hợp lệ",
  PASSWORD_REQUIRED: "Mật khẩu là bắt buộc",
  FULL_NAME_REQUIRED: "Họ tên là bắt buộc",
  ROLE_REQUIRED: "Vai trò là bắt buộc",
  
  // Session
  SESSION_EXPIRED: "Phiên đăng nhập đã hết hạn",
  NOT_AUTHENTICATED: "Vui lòng đăng nhập để tiếp tục",
  LOGOUT_FAILED: "Đăng xuất thất bại",
  
  // Verification
  EMAIL_NOT_VERIFIED: "Vui lòng xác thực email của bạn",
  VERIFICATION_FAILED: "Xác thực thất bại",
  TOKEN_EXPIRED: "Mã xác thực đã hết hạn",
} as const;

export const USER_ERRORS = {
  // Profile
  PROFILE_NOT_FOUND: "Không tìm thấy hồ sơ người dùng",
  PROFILE_UPDATE_FAILED: "Cập nhật hồ sơ thất bại",
  AVATAR_UPLOAD_FAILED: "Tải ảnh đại diện thất bại",
  
  // Validation
  PHONE_INVALID: "Số điện thoại không hợp lệ",
  LINKEDIN_URL_INVALID: "URL LinkedIn không hợp lệ",
  PORTFOLIO_URL_INVALID: "URL Portfolio không hợp lệ",
  BIO_TOO_LONG: "Giới thiệu không được quá 500 ký tự",
  
  // Role/Permission
  ROLE_CHANGE_FAILED: "Thay đổi vai trò thất bại",
  ACCOUNT_DEACTIVATED: "Tài khoản đã bị vô hiệu hóa",
  INSUFFICIENT_PERMISSIONS: "Không đủ quyền hạn",
} as const;

export const COMPANY_ERRORS = {
  // CRUD Operations
  COMPANY_NOT_FOUND: "Không tìm thấy công ty",
  COMPANY_CREATE_FAILED: "Tạo công ty thất bại",
  COMPANY_UPDATE_FAILED: "Cập nhật thông tin công ty thất bại",
  COMPANY_DELETE_FAILED: "Xóa công ty thất bại",
  
  // Validation
  COMPANY_NAME_REQUIRED: "Tên công ty là bắt buộc",
  COMPANY_SLUG_REQUIRED: "Slug công ty là bắt buộc",
  COMPANY_SLUG_EXISTS: "Slug công ty đã tồn tại",
  COMPANY_EMAIL_INVALID: "Email công ty không hợp lệ",
  COMPANY_WEBSITE_INVALID: "Website công ty không hợp lệ",
  DESCRIPTION_TOO_LONG: "Mô tả công ty không được quá 2000 ký tự",
  
  // Verification
  COMPANY_NOT_VERIFIED: "Công ty chưa được xác minh",
  VERIFICATION_PENDING: "Đang chờ xác minh công ty",
  VERIFICATION_REJECTED: "Xác minh công ty bị từ chối",
  
  // Members
  MEMBER_NOT_FOUND: "Không tìm thấy thành viên",
  MEMBER_ADD_FAILED: "Thêm thành viên thất bại",
  MEMBER_REMOVE_FAILED: "Xóa thành viên thất bại",
  NOT_COMPANY_MEMBER: "Bạn không phải là thành viên của công ty này",
  PRIMARY_MEMBER_REQUIRED: "Công ty phải có ít nhất một thành viên chính",
} as const;

export const JOB_ERRORS = {
  // CRUD Operations
  JOB_NOT_FOUND: "Không tìm thấy việc làm",
  JOB_CREATE_FAILED: "Tạo việc làm thất bại",
  JOB_UPDATE_FAILED: "Cập nhật việc làm thất bại",
  JOB_DELETE_FAILED: "Xóa việc làm thất bại",
  JOB_PUBLISH_FAILED: "Đăng việc làm thất bại",
  
  // Validation
  JOB_TITLE_REQUIRED: "Tiêu đề việc làm là bắt buộc",
  JOB_DESCRIPTION_REQUIRED: "Mô tả việc làm là bắt buộc",
  JOB_SLUG_REQUIRED: "Slug việc làm là bắt buộc",
  JOB_SLUG_EXISTS: "Slug việc làm đã tồn tại",
  SALARY_RANGE_INVALID: "Khoảng lương không hợp lệ",
  EMPLOYMENT_TYPE_INVALID: "Loại hình công việc không hợp lệ",
  EXPERIENCE_LEVEL_INVALID: "Mức kinh nghiệm không hợp lệ",
  
  // Status
  JOB_NOT_PUBLISHED: "Việc làm chưa được công bố",
  JOB_EXPIRED: "Việc làm đã hết hạn",
  JOB_CLOSED: "Việc làm đã đóng",
  
  // Skills
  SKILL_ADD_FAILED: "Thêm kỹ năng thất bại",
  SKILL_REMOVE_FAILED: "Xóa kỹ năng thất bại",
  SKILL_NOT_FOUND: "Không tìm thấy kỹ năng",
} as const;

export const APPLICATION_ERRORS = {
  // Apply Process
  APPLICATION_FAILED: "Nộp đơn ứng tuyển thất bại",
  ALREADY_APPLIED: "Bạn đã ứng tuyển vị trí này",
  APPLICATION_NOT_FOUND: "Không tìm thấy đơn ứng tuyển",
  
  // Validation
  CV_REQUIRED: "CV là bắt buộc để ứng tuyển",
  COVER_LETTER_TOO_LONG: "Thư xin việc không được quá 1000 ký tự",
  
  // Status Management
  STATUS_UPDATE_FAILED: "Cập nhật trạng thái thất bại",
  INVALID_STATUS_TRANSITION: "Chuyển đổi trạng thái không hợp lệ",
  CANNOT_WITHDRAW: "Không thể rút đơn ứng tuyển",
  
  // Permissions
  NOT_APPLICATION_OWNER: "Bạn không phải chủ của đơn ứng tuyển này",
  CANNOT_VIEW_APPLICATION: "Bạn không được phép xem đơn ứng tuyển này",
} as const;

export const CV_ERRORS = {
  // CRUD Operations
  CV_NOT_FOUND: "Không tìm thấy CV",
  CV_UPLOAD_FAILED: "Tải CV thất bại",
  CV_DELETE_FAILED: "Xóa CV thất bại",
  CV_UPDATE_FAILED: "Cập nhật CV thất bại",
  
  // Validation
  CV_TITLE_REQUIRED: "Tiêu đề CV là bắt buộc",
  CV_FILE_REQUIRED: "File CV là bắt buộc",
  CV_FILE_TOO_LARGE: "File CV không được vượt quá 10MB",
  CV_FILE_INVALID_FORMAT: "Chỉ chấp nhận file PDF, DOC, DOCX",
  
  // Primary CV
  PRIMARY_CV_REQUIRED: "Bạn phải có ít nhất một CV chính",
  SET_PRIMARY_FAILED: "Đặt CV chính thất bại",
} as const;

export const SKILL_ERRORS = {
  // Operations
  SKILL_NOT_FOUND: "Không tìm thấy kỹ năng",
  SKILL_ADD_FAILED: "Thêm kỹ năng thất bại",
  SKILL_UPDATE_FAILED: "Cập nhật kỹ năng thất bại",
  SKILL_DELETE_FAILED: "Xóa kỹ năng thất bại",
  
  // Validation
  SKILL_NAME_REQUIRED: "Tên kỹ năng là bắt buộc",
  SKILL_ALREADY_EXISTS: "Kỹ năng đã tồn tại",
  PROFICIENCY_LEVEL_INVALID: "Mức độ thành thạo phải từ 1 đến 5",
  YEARS_EXPERIENCE_INVALID: "Số năm kinh nghiệm không hợp lệ",
} as const;

export const MESSAGE_ERRORS = {
  // Send/Receive
  MESSAGE_SEND_FAILED: "Gửi tin nhắn thất bại",
  MESSAGE_NOT_FOUND: "Không tìm thấy tin nhắn",
  MESSAGE_DELETE_FAILED: "Xóa tin nhắn thất bại",
  
  // Validation
  MESSAGE_CONTENT_REQUIRED: "Nội dung tin nhắn là bắt buộc",
  MESSAGE_CONTENT_TOO_LONG: "Tin nhắn không được quá 2000 ký tự",
  RECIPIENT_REQUIRED: "Người nhận là bắt buộc",
  INVALID_RECIPIENT: "Người nhận không hợp lệ",
  
  // Permissions
  CANNOT_MESSAGE_SELF: "Không thể gửi tin nhắn cho chính mình",
  MESSAGE_ACCESS_DENIED: "Bạn không được phép xem tin nhắn này",
} as const;

export const SAVED_JOB_ERRORS = {
  // Save/Unsave
  SAVE_JOB_FAILED: "Lưu việc làm thất bại",
  UNSAVE_JOB_FAILED: "Bỏ lưu việc làm thất bại",
  JOB_ALREADY_SAVED: "Việc làm đã được lưu",
  JOB_NOT_SAVED: "Việc làm chưa được lưu",
  SAVED_JOB_NOT_FOUND: "Không tìm thấy việc làm đã lưu",
  SEARCH_FAILED: "Tìm kiếm việc làm đã lưu thất bại",
} as const;

export const SEARCH_ERRORS = {
  // Search Operations
  SEARCH_FAILED: "Tìm kiếm thất bại",
  INVALID_SEARCH_QUERY: "Từ khóa tìm kiếm không hợp lệ",
  NO_RESULTS_FOUND: "Không tìm thấy kết quả nào",
  
  // Filters
  INVALID_FILTER_VALUE: "Giá trị lọc không hợp lệ",
  FILTER_APPLY_FAILED: "Áp dụng bộ lọc thất bại",
} as const;

export const ADMIN_ERRORS = {
  // Content Moderation
  APPROVAL_FAILED: "Phê duyệt thất bại",
  REJECTION_FAILED: "Từ chối thất bại",
  MODERATION_FAILED: "Kiểm duyệt thất bại",
  
  // User Management
  USER_DEACTIVATION_FAILED: "Vô hiệu hóa người dùng thất bại",
  USER_ACTIVATION_FAILED: "Kích hoạt người dùng thất bại",
  ROLE_ASSIGNMENT_FAILED: "Phân quyền thất bại",
  
  // System
  DASHBOARD_LOAD_FAILED: "Tải dashboard thất bại",
  EXPORT_FAILED: "Xuất dữ liệu thất bại",
  STATS_CALCULATION_FAILED: "Tính toán thống kê thất bại",
} as const;

export const FILE_ERRORS = {
  // Upload
  FILE_UPLOAD_FAILED: "Tải file thất bại",
  FILE_TOO_LARGE: "File quá lớn",
  FILE_TYPE_NOT_SUPPORTED: "Loại file không được hỗ trợ",
  FILE_CORRUPTED: "File bị hỏng",
  
  // Storage
  STORAGE_QUOTA_EXCEEDED: "Vượt quá dung lượng lưu trữ",
  FILE_NOT_FOUND: "Không tìm thấy file",
  FILE_DELETE_FAILED: "Xóa file thất bại",
} as const;

// Helper functions for error handling
export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return GENERIC_ERRORS.SOMETHING_WENT_WRONG;
}

export function isAuthError(error: string): boolean {
  return Object.values(AUTH_ERRORS).includes(error as typeof AUTH_ERRORS[keyof typeof AUTH_ERRORS]);
}

export function isValidationError(error: string): boolean {
  return error.includes("bắt buộc") || 
         error.includes("không hợp lệ") ||
         error.includes("quá") ||
         error.includes("phải có");
}

export function formatErrorForUser(error: unknown): string {
  const message = getErrorMessage(error);
  
  // Don't expose internal server errors to users
  if (message.includes("Internal") || message.includes("500")) {
    return GENERIC_ERRORS.SOMETHING_WENT_WRONG;
  }
  
  return message;
}

// Error type guards for better type safety
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes("fetch") || 
           error.message.includes("network") ||
           error.message.includes("NetworkError");
  }
  return false;
}

export function isTimeoutError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes("timeout") || 
           error.message.includes("TimeoutError");
  }
  return false;
}

// Export all error categories for easy importing
export const ALL_ERRORS = {
  GENERIC: GENERIC_ERRORS,
  AUTH: AUTH_ERRORS,
  USER: USER_ERRORS,
  COMPANY: COMPANY_ERRORS,
  JOB: JOB_ERRORS,
  APPLICATION: APPLICATION_ERRORS,
  CV: CV_ERRORS,
  SKILL: SKILL_ERRORS,
  MESSAGE: MESSAGE_ERRORS,
  SAVED_JOB: SAVED_JOB_ERRORS,
  SEARCH: SEARCH_ERRORS,
  ADMIN: ADMIN_ERRORS,
  FILE: FILE_ERRORS,
} as const;
