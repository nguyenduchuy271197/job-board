# Information Architecture - Job Board MVP

_Dựa trên Database Schema và Complete Actions/Hooks Implementation cho thị trường tuyển dụng Việt Nam_

## Tổng quan Hệ thống MVP

### Đối tượng người dùng

- **Ứng viên (Candidates)**: Tìm kiếm việc làm, nộp đơn ứng tuyển và quản lý CV
- **Nhà tuyển dụng (Employers)**: Đăng tin tuyển dụng, quản lý ứng viên và công ty
- **Quản trị viên (Admins)**: Kiểm duyệt nội dung, quản lý người dùng và thống kê hệ thống
- **Guest**: Xem danh sách việc làm và thông tin công ty

### Mục tiêu MVP

- Cung cấp nền tảng tuyển dụng hiệu quả cho thị trường Việt Nam
- Kết nối ứng viên và nhà tuyển dụng một cách chuyên nghiệp
- Quản lý quy trình tuyển dụng từ đăng tin đến tuyển chọn
- Cung cấp công cụ phân tích và báo cáo cơ bản

## Cấu trúc Navigation MVP

### 1. Guest Navigation (Public Pages)

```
🌐 Public Pages
├── 🏠 Trang chủ
│   ├── Hero section với tìm kiếm việc làm
│   ├── Việc làm nổi bật
│   ├── Công ty hàng đầu
│   ├── Thống kê thị trường
│   └── CTA đăng ký tài khoản
├── 💼 Danh sách việc làm
│   ├── Grid/List view các công việc
│   ├── Lọc theo vị trí, lương, kinh nghiệm
│   ├── Tìm kiếm nâng cao
│   ├── Sắp xếp (mới nhất, lương cao)
│   └── Pagination
├── 📖 Chi tiết việc làm
│   ├── Thông tin công việc
│   ├── Yêu cầu và kỹ năng
│   ├── Phúc lợi và mức lương
│   ├── Thông tin công ty
│   └── CTA đăng nhập để ứng tuyển
├── 🏢 Danh sách công ty
│   ├── Grid view các công ty
│   ├── Lọc theo ngành nghề, quy mô
│   ├── Tìm kiếm công ty
│   └── Thông tin tuyển dụng
├── 🏢 Chi tiết công ty
│   ├── Thông tin tổng quan
│   ├── Văn hóa công ty
│   ├── Việc làm đang tuyển
│   └── Thông tin liên hệ
├── 🔑 Đăng nhập
└── ✍️ Đăng ký
    ├── Đăng ký ứng viên
    └── Đăng ký nhà tuyển dụng
```

### 2. Candidate Navigation

```
👤 Candidate Dashboard
├── 🏠 Dashboard
│   ├── Tổng quan hoạt động
│   ├── Đơn ứng tuyển gần đây
│   ├── Việc làm đã lưu
│   ├── Việc làm gợi ý
│   ├── Trạng thái ứng tuyển
│   └── Thông báo mới
├── 💼 Tìm việc làm
│   ├── Tìm kiếm nâng cao
│   ├── Lọc theo nhiều tiêu chí
│   ├── Lưu tìm kiếm
│   ├── Cảnh báo việc làm mới
│   └── Việc làm phù hợp
├── 📄 Quản lý CV
│   ├── Danh sách CV
│   ├── Tạo CV trực tuyến
│   ├── Upload CV file
│   ├── Xem trước CV
│   ├── Đặt CV chính
│   └── Chia sẻ CV
├── 🎯 Kỹ năng của tôi
│   ├── Danh sách kỹ năng hiện tại
│   ├── Thêm kỹ năng mới
│   ├── Đánh giá mức độ thành thạo
│   ├── Chứng chỉ kỹ năng
│   └── Gợi ý kỹ năng
├── 📝 Đơn ứng tuyển
│   ├── Đang chờ phản hồi
│   ├── Đã được mời phỏng vấn
│   ├── Đã được tuyển
│   ├── Bị từ chối
│   ├── Đã rút đơn
│   └── Lịch sử ứng tuyển
├── ⭐ Việc làm đã lưu
│   ├── Danh sách đã lưu
│   ├── Ghi chú cá nhân
│   ├── Theo dõi cập nhật
│   └── Ứng tuyển nhanh
├── 💬 Tin nhắn
│   ├── Hộp thư đến
│   ├── Tin nhắn từ HR
│   ├── Thông báo phỏng vấn
│   └── Phản hồi ứng tuyển
├── 👤 Hồ sơ cá nhân
│   ├── Thông tin cơ bản
│   ├── Avatar và liên hệ
│   ├── Kinh nghiệm làm việc
│   ├── Học vấn
│   └── Sở thích cá nhân
└── ⚙️ Cài đặt
    ├── Thông tin tài khoản
    ├── Quyền riêng tư
    ├── Thông báo email
    └── Tùy chọn tìm việc
```

### 3. Employer Navigation

```
🏢 Employer Dashboard
├── 🏠 Tổng quan
│   ├── Thống kê tuyển dụng
│   │   ├── Số lượng tin đăng
│   │   ├── Lượt ứng tuyển
│   │   ├── Tỷ lệ phản hồi
│   │   └── Hiệu quả tuyển dụng
│   ├── Hoạt động gần đây
│   │   ├── Ứng tuyển mới
│   │   ├── CV được xem
│   │   └── Tin nhắn chưa đọc
│   ├── Việc làm hiệu suất cao
│   └── Cảnh báo hệ thống
├── 🏢 Thông tin công ty
│   ├── Hồ sơ công ty
│   │   ├── Thông tin cơ bản
│   │   ├── Logo và hình ảnh
│   │   ├── Mô tả công ty
│   │   ├── Văn hóa doanh nghiệp
│   │   └── Thông tin liên hệ
│   ├── Xác minh công ty
│   │   ├── Trạng thái xác minh
│   │   ├── Tài liệu chứng minh
│   │   └── Quy trình duyệt
│   └── Quản lý thành viên
│       ├── Danh sách thành viên
│       ├── Mời thành viên mới
│       ├── Phân quyền
│       └── Quản lý vai trò
├── 💼 Quản lý việc làm
│   ├── Danh sách tin tuyển dụng
│   │   ├── Đang tuyển
│   │   ├── Bản nháp
│   │   ├── Tạm dừng
│   │   ├── Đã đóng
│   │   └── Hết hạn
│   ├── Tạo tin tuyển dụng
│   │   ├── Thông tin cơ bản
│   │   │   ├── Tiêu đề công việc
│   │   │   ├── Mô tả chi tiết
│   │   │   ├── Yêu cầu công việc
│   │   │   └── Phúc lợi
│   │   ├── Điều kiện tuyển dụng
│   │   │   ├── Mức lương
│   │   │   ├── Kinh nghiệm
│   │   │   ├── Địa điểm làm việc
│   │   │   └── Loại hình công việc
│   │   ├── Kỹ năng yêu cầu
│   │   └── Cài đặt đăng tin
│   ├── Chỉnh sửa tin tuyển dụng
│   │   ├── Cập nhật thông tin
│   │   ├── Gia hạn tin đăng
│   │   ├── Thay đổi trạng thái
│   │   └── Xóa tin đăng
│   └── Thống kê tin tuyển dụng
│       ├── Lượt xem tin
│       ├── Số đơn ứng tuyển
│       ├── Tỷ lệ chuyển đổi
│       └── Hiệu quả theo thời gian
├── 👥 Quản lý ứng viên
│   ├── Danh sách ứng viên
│   │   ├── Ứng viên mới
│   │   ├── Đang xem xét
│   │   ├── Mời phỏng vấn
│   │   ├── Đã tuyển
│   │   └── Từ chối
│   ├── Chi tiết ứng viên
│   │   ├── Thông tin cá nhân
│   │   ├── CV và portfolio
│   │   ├── Kỹ năng và kinh nghiệm
│   │   ├── Lịch sử ứng tuyển
│   │   └── Ghi chú nội bộ
│   ├── Tìm kiếm ứng viên
│   │   ├── Tìm theo kỹ năng
│   │   ├── Lọc theo kinh nghiệm
│   │   ├── Lọc theo địa điểm
│   │   └── Tìm kiếm nâng cao
│   ├── Quản lý trạng thái
│   │   ├── Cập nhật trạng thái
│   │   ├── Lên lịch phỏng vấn
│   │   ├── Gửi thông báo
│   │   └── Đánh giá ứng viên
│   └── Báo cáo tuyển dụng
│       ├── Funnel tuyển dụng
│       ├── Thời gian tuyển dụng
│       ├── Nguồn ứng viên
│       └── Chất lượng tuyển dụng
├── 💬 Tin nhắn
│   ├── Hộp thư đến
│   ├── Tin nhắn với ứng viên
│   ├── Thông báo hệ thống
│   ├── Lịch hẹn phỏng vấn
│   └── Template tin nhắn
└── 📊 Báo cáo & Phân tích
    ├── Dashboard tuyển dụng
    ├── Hiệu quả tin đăng
    ├── Phân tích ứng viên
    ├── Báo cáo chi phí
    └── Xu hướng thị trường
```

### 4. Admin Navigation

```
🛡️ Admin Dashboard
├── 🏠 Tổng quan hệ thống
│   ├── Thống kê tổng quan
│   │   ├── Tổng số người dùng
│   │   ├── Tổng số công ty
│   │   ├── Tổng số việc làm
│   │   ├── Tổng số ứng tuyển
│   │   └── Hoạt động hôm nay
│   ├── Hoạt động gần đây
│   │   ├── Đăng ký mới
│   │   ├── Tin tuyển dụng mới
│   │   ├── Ứng tuyển mới
│   │   └── Báo cáo vi phạm
│   ├── Công ty và việc làm hot
│   └── Cảnh báo hệ thống
├── 👥 Quản lý người dùng
│   ├── Danh sách người dùng
│   │   ├── Tất cả người dùng
│   │   ├── Ứng viên
│   │   ├── Nhà tuyển dụng
│   │   ├── Tài khoản bị khóa
│   │   └── Tìm kiếm người dùng
│   ├── Chi tiết người dùng
│   │   ├── Thông tin cá nhân
│   │   ├── Lịch sử hoạt động
│   │   ├── Thống kê sử dụng
│   │   └── Quản lý trạng thái
│   ├── Quản lý tài khoản
│   │   ├── Kích hoạt/Khóa tài khoản
│   │   ├── Đổi vai trò
│   │   ├── Reset mật khẩu
│   │   └── Xóa tài khoản
│   └── Thống kê người dùng
│       ├── Đăng ký theo thời gian
│       ├── Độ tương tác
│       ├── Phân tích hành vi
│       └── Retention rate
├── 🏢 Quản lý công ty
│   ├── Danh sách công ty
│   │   ├── Chờ xác minh
│   │   ├── Đã xác minh
│   │   ├── Bị từ chối
│   │   ├── Tạm khóa
│   │   └── Tìm kiếm công ty
│   ├── Xác minh công ty
│   │   ├── Thông tin công ty
│   │   ├── Tài liệu pháp lý
│   │   ├── Duyệt/Từ chối
│   │   └── Ghi chú xác minh
│   ├── Quản lý công ty
│   │   ├── Chỉnh sửa thông tin
│   │   ├── Quản lý trạng thái
│   │   ├── Xem hoạt động
│   │   └── Liên hệ công ty
│   └── Thống kê công ty
│       ├── Công ty theo ngành
│       ├── Tỷ lệ xác minh
│       ├── Hoạt động tuyển dụng
│       └── Đánh giá chất lượng
├── 💼 Quản lý việc làm
│   ├── Danh sách việc làm
│   │   ├── Chờ duyệt
│   │   ├── Đã duyệt
│   │   ├── Bị từ chối
│   │   ├── Báo cáo vi phạm
│   │   └── Tìm kiếm việc làm
│   ├── Kiểm duyệt việc làm
│   │   ├── Nội dung tin đăng
│   │   ├── Tuân thủ quy định
│   │   ├── Duyệt/Từ chối
│   │   └── Ghi chú kiểm duyệt
│   ├── Quản lý nội dung
│   │   ├── Ẩn/Hiển thị tin
│   │   ├── Chỉnh sửa nội dung
│   │   ├── Gắn cờ cảnh báo
│   │   └── Xóa tin vi phạm
│   └── Thống kê việc làm
│       ├── Tin đăng theo thời gian
│       ├── Việc làm theo ngành
│       ├── Mức lương trung bình
│       └── Tỷ lệ tuyển dụng
├── 🗂️ Quản lý dữ liệu chính
│   ├── Quản lý ngành nghề
│   │   ├── Danh sách ngành nghề
│   │   ├── Thêm/Sửa/Xóa
│   │   ├── Thống kê sử dụng
│   │   └── SEO settings
│   ├── Quản lý địa điểm
│   │   ├── Danh sách thành phố
│   │   ├── Quản lý tỉnh/thành
│   │   ├── Cập nhật thông tin
│   │   └── Thống kê việc làm
│   ├── Quản lý kỹ năng
│   │   ├── Danh sách kỹ năng
│   │   ├── Phân loại kỹ năng
│   │   ├── Kỹ năng phổ biến
│   │   └── Gợi ý kỹ năng
│   └── Cài đặt hệ thống
│       ├── Cấu hình chung
│       ├── Email templates
│       ├── Notification settings
│       └── Feature toggles
└── 📊 Báo cáo & Thống kê
    ├── Dashboard analytics
    ├── Báo cáo người dùng
    ├── Báo cáo tuyển dụng
    ├── Báo cáo hệ thống
    └── Export dữ liệu
```

## User Flows MVP

### 1. Candidate Journey

#### A. Đăng ký và Tìm việc

```
Landing Page → Tìm kiếm việc làm →
Xem kết quả tìm kiếm →
Click chi tiết việc làm →
Đọc mô tả công việc →
Click "Ứng tuyển" →
Đăng ký tài khoản (email, password, họ tên) →
Xác thực email →
Hoàn thành profile cơ bản →
Upload/Tạo CV → Nộp đơn ứng tuyển thành công
```

#### B. Quản lý CV và Ứng tuyển

```
Dashboard → Quản lý CV →
Tạo CV mới hoặc upload file →
Điền thông tin chi tiết →
Thêm kỹ năng và kinh nghiệm →
Xem trước và lưu CV →
Đặt làm CV chính →
Ứng tuyển các vị trí phù hợp →
Theo dõi trạng thái đơn ứng tuyển
```

#### C. Tương tác với Nhà tuyển dụng

```
Nhận thông báo từ HR →
Đọc tin nhắn mời phỏng vấn →
Phản hồi lịch hẹn →
Chuẩn bị cho phỏng vấn →
Nhận kết quả tuyển dụng →
Phản hồi offer làm việc
```

### 2. Employer Journey

#### A. Đăng ký và Thiết lập Công ty

```
Landing Page → Đăng ký nhà tuyển dụng →
Xác thực email → Tạo profile công ty →
Upload logo và hình ảnh →
Điền thông tin chi tiết công ty →
Gửi yêu cầu xác minh →
Chờ admin duyệt →
Nhận thông báo xác minh thành công
```

#### B. Đăng tin và Quản lý Tuyển dụng

```
Dashboard → Tạo tin tuyển dụng mới →
Điền thông tin công việc →
Thêm yêu cầu và kỹ năng →
Thiết lập mức lương →
Xem trước tin đăng →
Đăng tin tuyển dụng →
Chờ admin duyệt →
Tin được phê duyệt và hiển thị
```

#### C. Quản lý Ứng viên

```
Nhận thông báo ứng tuyển mới →
Xem danh sách ứng viên →
Review CV và profile →
Lọc ứng viên phù hợp →
Cập nhật trạng thái ứng tuyển →
Gửi tin nhắn mời phỏng vấn →
Đánh giá sau phỏng vấn →
Quyết định tuyển dụng
```

### 3. Admin Journey

#### A. Quản lý Nội dung

```
Admin Login → Xem dashboard tổng quan →
Kiểm tra tin tuyển dụng chờ duyệt →
Review nội dung và tuân thủ →
Duyệt/Từ chối tin đăng →
Gửi thông báo cho nhà tuyển dụng →
Theo dõi hoạt động hệ thống
```

#### B. Xác minh Công ty

```
Nhận yêu cầu xác minh công ty →
Kiểm tra thông tin công ty →
Xem tài liệu pháp lý →
Xác minh thông tin →
Duyệt/Từ chối xác minh →
Gửi thông báo kết quả
```

#### C. Phân tích và Báo cáo

```
Dashboard → Xem thống kê hệ thống →
Phân tích xu hướng tuyển dụng →
Tạo báo cáo định kỳ →
Theo dõi KPI hệ thống →
Đưa ra quyết định tối ưu
```

### 4. Guest Journey

#### A. Khám phá Việc làm

```
Landing page → Tìm kiếm việc làm →
Lọc theo vị trí/lương/kinh nghiệm →
Xem danh sách kết quả →
Click xem chi tiết →
Đọc mô tả công việc →
Quan tâm → Click "Ứng tuyển" →
Chuyển hướng đến đăng ký
```

## Page Structure & Components

### Core Pages (All Users)

#### **Homepage (`/`)**

- Hero section với thanh tìm kiếm việc làm
- Việc làm nổi bật và mới nhất
- Công ty hàng đầu đang tuyển dụng
- Thống kê thị trường (số việc làm, công ty, ứng viên)
- Ngành nghề phổ biến
- CTA đăng ký theo vai trò

#### **Job Listings (`/jobs`)**

- Danh sách việc làm với filters
- Sidebar lọc (địa điểm, lương, kinh nghiệm, ngành nghề)
- Tìm kiếm nâng cao
- Sort options (mới nhất, lương cao, phổ biến)
- Job cards với thông tin cơ bản
- Pagination và lazy loading

#### **Job Details (`/jobs/[slug]`)**

- Thông tin chi tiết công việc
- Yêu cầu và kỹ năng cần thiết
- Mức lương và phúc lợi
- Thông tin công ty tuyển dụng
- Việc làm liên quan
- CTA ứng tuyển (login required)

#### **Company Listings (`/companies`)**

- Grid view các công ty
- Lọc theo ngành nghề, quy mô
- Thông tin cơ bản công ty
- Số lượng việc làm đang tuyển

#### **Company Details (`/companies/[slug]`)**

- Profile công ty chi tiết
- Văn hóa và môi trường làm việc
- Danh sách việc làm đang tuyển
- Thông tin liên hệ

#### **Authentication Pages**

- `/login` - Form đăng nhập
- `/register` - Đăng ký theo vai trò
- `/forgot-password` - Quên mật khẩu
- `/verify-email` - Xác thực email

### Candidate Pages

#### **Dashboard (`/dashboard`)**

- Tổng quan hoạt động cá nhân
- Đơn ứng tuyển gần đây
- Việc làm đã lưu
- Việc làm gợi ý dựa trên profile
- Thông báo và tin nhắn mới

#### **Job Search (`/jobs/search`)**

- Tìm kiếm nâng cao với nhiều filters
- Lưu tìm kiếm và tạo job alert
- Kết quả tìm kiếm cá nhân hóa

#### **CV Management (`/cv`)**

- Danh sách CV với preview
- Tạo CV online với templates
- Upload CV file (PDF, DOC)
- Quản lý CV chính và phụ

#### **Skills Management (`/skills`)**

- Danh sách kỹ năng hiện tại
- Thêm kỹ năng với mức độ thành thạo
- Gợi ý kỹ năng dựa trên ngành nghề

#### **Applications (`/applications`)**

- Danh sách đơn ứng tuyển theo trạng thái
- Chi tiết từng đơn ứng tuyển
- Lịch sử tương tác với HR

#### **Saved Jobs (`/saved`)**

- Việc làm đã lưu với ghi chú
- Theo dõi cập nhật việc làm
- Ứng tuyển nhanh

#### **Messages (`/messages`)**

- Hộp thư trao đổi với HR
- Thông báo từ hệ thống
- Lịch hẹn phỏng vấn

#### **Profile (`/profile`)**

- Thông tin cá nhân chi tiết
- Kinh nghiệm và học vấn
- Portfolio và dự án
- Cài đặt quyền riêng tư

### Employer Pages

#### **Dashboard (`/employer/dashboard`)**

- Thống kê tuyển dụng tổng quan
- Hoạt động gần đây
- Hiệu quả tin đăng
- Ứng viên mới và chờ xử lý

#### **Company Profile (`/employer/company`)**

- Quản lý thông tin công ty
- Upload logo và hình ảnh
- Cài đặt xác minh công ty
- Quản lý thành viên team

#### **Job Management (`/employer/jobs`)**

- Danh sách tin tuyển dụng theo trạng thái
- Tạo và chỉnh sửa tin đăng
- Quản lý thời hạn tin đăng
- Thống kê hiệu quả từng tin

#### **Candidate Management (`/employer/candidates`)**

- Danh sách ứng viên theo job
- Lọc và tìm kiếm ứng viên
- Quản lý trạng thái ứng tuyển
- CV và profile chi tiết

#### **Candidate Search (`/employer/search-candidates`)**

- Tìm kiếm ứng viên chủ động
- Lọc theo kỹ năng, kinh nghiệm
- Gửi lời mời ứng tuyển

#### **Messages (`/employer/messages`)**

- Trao đổi với ứng viên
- Template tin nhắn
- Lịch hẹn phỏng vấn

#### **Analytics (`/employer/analytics`)**

- Báo cáo tuyển dụng chi tiết
- Hiệu quả theo thời gian
- Phân tích nguồn ứng viên

### Admin Pages

#### **Admin Dashboard (`/admin`)**

- Thống kê hệ thống tổng quan
- Hoạt động gần đây
- Cảnh báo và notifications
- Quick actions

#### **User Management (`/admin/users`)**

- Danh sách người dùng với filters
- Chi tiết và lịch sử người dùng
- Quản lý trạng thái tài khoản
- Thống kê người dùng

#### **Company Management (`/admin/companies`)**

- Danh sách công ty chờ xác minh
- Quy trình xác minh công ty
- Quản lý trạng thái công ty
- Thống kê công ty

#### **Job Management (`/admin/jobs`)**

- Danh sách tin chờ duyệt
- Kiểm duyệt nội dung tin đăng
- Quản lý tin vi phạm
- Thống kê việc làm

#### **Master Data (`/admin/master-data`)**

- Quản lý ngành nghề
- Quản lý địa điểm
- Quản lý kỹ năng
- Cài đặt hệ thống

#### **Analytics (`/admin/analytics`)**

- Dashboard phân tích tổng quan
- Báo cáo định kỳ
- Xu hướng thị trường
- Export dữ liệu

## Key Components Architecture

### Shared Components

#### **Navigation Components**

```
├── Header/Navigation
│   ├── Logo & branding
│   ├── Main navigation menu
│   ├── Job search bar
│   ├── User menu dropdown
│   ├── Notifications
│   └── Mobile menu
├── Footer
│   ├── Quick links
│   ├── Company information
│   ├── Legal links
│   └── Social media
└── Breadcrumbs
    ├── Page navigation
    └── Context awareness
```

#### **Job Components**

```
├── Job Card
│   ├── Job title & company
│   ├── Location & salary
│   ├── Job type & experience
│   ├── Posted date
│   ├── Save job button
│   └── Quick apply CTA
├── Job Details
│   ├── Complete job description
│   ├── Requirements & skills
│   ├── Benefits & perks
│   ├── Company information
│   └── Apply button
├── Job Filters
│   ├── Location filter
│   ├── Salary range
│   ├── Experience level
│   ├── Job type
│   └── Industry filter
└── Job Search
    ├── Search input với suggestions
    ├── Advanced search form
    ├── Saved searches
    └── Search results
```

#### **Company Components**

```
├── Company Card
│   ├── Company logo
│   ├── Company name & industry
│   ├── Location & size
│   ├── Open positions
│   └── Follow company button
├── Company Profile
│   ├── Company overview
│   ├── Culture & benefits
│   ├── Photo gallery
│   ├── Current openings
│   └── Contact information
└── Company Verification
    ├── Verification status
    ├── Trust indicators
    └── Verification badge
```

#### **Application Components**

```
├── Application Form
│   ├── CV selection
│   ├── Cover letter
│   ├── Additional questions
│   └── Submit application
├── Application Status
│   ├── Status indicators
│   ├── Timeline tracking
│   ├── HR feedback
│   └── Next steps
└── Application List
    ├── Status filters
    ├── Application cards
    ├── Bulk actions
    └── Search applications
```

### Role-specific Components

#### **Candidate Components**

```
├── CV Builder
│   ├── Template selection
│   ├── Section management
│   ├── Real-time preview
│   ├── PDF export
│   └── Sharing options
├── Skill Management
│   ├── Skill search & add
│   ├── Proficiency levels
│   ├── Skill categories
│   └── Skill recommendations
├── Job Alerts
│   ├── Alert configuration
│   ├── Frequency settings
│   ├── Email notifications
│   └── Alert management
└── Profile Completion
    ├── Progress indicator
    ├── Missing fields
    ├── Profile strength
    └── Improvement suggestions
```

#### **Employer Components**

```
├── Job Posting Form
│   ├── Multi-step wizard
│   ├── Rich text editor
│   ├── Skill selector
│   ├── Preview mode
│   └── Publishing options
├── Candidate Pipeline
│   ├── Kanban board
│   ├── Drag & drop
│   ├── Status management
│   ├── Bulk actions
│   └── Interview scheduling
├── Company Analytics
│   ├── Recruitment metrics
│   ├── Job performance
│   ├── Candidate sources
│   └── Time-to-hire
└── Team Management
    ├── Member invitations
    ├── Role assignments
    ├── Permission management
    └── Activity tracking
```

#### **Admin Components**

```
├── Content Moderation
│   ├── Approval queue
│   ├── Content review
│   ├── Bulk approval
│   ├── Rejection reasons
│   └── Moderation history
├── User Management
│   ├── User search & filters
│   ├── Account status
│   ├── Role management
│   ├── Activity monitoring
│   └── Bulk operations
├── System Analytics
│   ├── Real-time metrics
│   ├── Usage statistics
│   ├── Performance monitoring
│   └── Custom dashboards
└── Master Data Management
    ├── Category management
    ├── Location hierarchy
    ├── Skill taxonomy
    └── System configuration
```

## MVP Feature Mapping & Priorities

### Phase 1 - Core Foundation (Week 1-2)

**Authentication & Basic Job Browsing**

```
✅ Essential Features (Must Have)
├── User registration/login system
├── Role-based access (Candidate/Employer/Admin)
├── Basic job listing and details
├── Company profiles
├── Job search and filters
└── Responsive design

📊 Success Metrics:
├── User registration success rate > 90%
├── Job search usage > 80% of sessions
├── Page load times < 3 seconds
└── Mobile compatibility
```

### Phase 2 - Job Application & Management (Week 3-4)

**CV Management & Application Process**

```
✅ Essential Features (Must Have)
├── CV upload and management
├── Job application system
├── Application status tracking
├── Employer job posting
├── Basic candidate management
└── Email notifications

📊 Success Metrics:
├── Application completion rate > 70%
├── CV upload success rate > 95%
├── Job posting completion > 80%
└── Email delivery rate > 98%
```

### Phase 3 - Communication & Admin (Week 5-6)

**Messaging & Content Moderation**

```
✅ Essential Features (Must Have)
├── Messaging system
├── Admin content moderation
├── Company verification
├── User management
├── Basic analytics dashboard
└── Master data management

📊 Success Metrics:
├── Message delivery rate > 95%
├── Content approval time < 24h
├── Admin efficiency improvement > 50%
└── System uptime > 99%
```

### Future Enhancements (Post-MVP)

**Advanced Features**

```
🚀 Future Features (Could Have)
├── Advanced search với AI matching
├── Video interviews
├── Skill assessments
├── Advanced analytics và reporting
├── Mobile apps
├── API integrations
├── Multi-language support
├── Advanced messaging features
└── Recruitment automation tools
```

## Technical Implementation Details

### Database Integration Mapping

```
Database Tables → UI Components
├── users → UserProfile, Dashboard, Settings
├── companies → CompanyCard, CompanyProfile, CompanyManager
├── jobs → JobCard, JobDetails, JobForm
├── applications → ApplicationForm, ApplicationStatus, ApplicationList
├── cvs → CVBuilder, CVManager, CVViewer
├── skills → SkillSelector, SkillManager
├── messages → MessageCenter, ChatInterface
├── saved_jobs → SavedJobsList, BookmarkButton
└── Storage → FileUploader, ImageManager, CVStorage
```

### State Management Architecture

```
Query Keys Structure:
├── auth: ['auth', 'profile']
├── jobs: ['jobs', filters] | ['jobs', 'detail', jobId]
├── companies: ['companies', filters] | ['companies', 'detail', companyId]
├── applications: ['applications', userId] | ['applications', 'job', jobId]
├── cvs: ['cvs', userId]
├── skills: ['skills'] | ['user-skills', userId]
├── messages: ['messages', userId]
├── saved-jobs: ['saved-jobs', userId]
└── admin: ['admin', 'dashboard'] | ['admin', 'users'] | ['admin', 'jobs']

Cache Strategies:
├── Static Data (15+ minutes): skills, industries, locations
├── Job Data (5 minutes): job listings, company profiles
├── User Data (2 minutes): applications, saved jobs, messages
└── Real-time Data (30 seconds): admin dashboard, notifications
```

### Performance Optimizations

```
├── Image optimization với next/image
├── Lazy loading cho job listings
├── Progressive loading cho search results
├── Efficient file upload với progress
├── Cache strategies cho static content
├── Mobile-first responsive design
└── SEO optimization cho job pages
```

## Data Flow Architecture

### Job Search & Application Flow

```
Job Discovery → Apply Filters → View Results →
Job Details → Check Requirements → Apply Decision →
Login/Register → CV Selection → Application Submission →
Status Tracking → HR Communication → Interview Process
```

### Employer Recruitment Flow

```
Company Setup → Job Creation → Content Review →
Job Publishing → Candidate Applications → CV Review →
Candidate Screening → Interview Scheduling →
Hiring Decision → Offer Management
```

### Admin Content Management Flow

```
Content Submission → Moderation Queue → Review Process →
Approval/Rejection → Notification Sending →
Analytics Tracking → Performance Monitoring
```

### Communication Flow

```
Application Submission → Notification to Employer →
Employer Review → Status Update → Candidate Notification →
Message Exchange → Interview Scheduling → Final Decision
```
