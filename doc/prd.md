# Functional Requirements cho MVP của Job Board

## Tính năng chung cho tất cả người dùng

| ID   | Nhóm tính năng | Tính năng                | Mô tả                                                                   | Độ ưu tiên | Dependencies |
| ---- | -------------- | ------------------------ | ----------------------------------------------------------------------- | ---------- | ------------ |
| FR01 | Xác thực       | Đăng ký tài khoản        | Cho phép người dùng tạo tài khoản ứng viên hoặc nhà tuyển dụng          | Cao        | Không có     |
| FR02 | Xác thực       | Đăng nhập/Xác thực       | Cho phép người dùng đăng nhập vào hệ thống với vai trò tương ứng        | Cao        | FR01         |
| FR03 | Xác thực       | Quản lý hồ sơ cá nhân    | Cho phép người dùng xem và chỉnh sửa thông tin cá nhân                  | Cao        | FR01, FR02   |
| FR04 | Việc làm       | Xem danh sách việc làm   | Hiển thị danh sách các công việc có sẵn với phân trang                  | Cao        | Không có     |
| FR05 | Việc làm       | Xem chi tiết việc làm    | Hiển thị thông tin chi tiết công việc, yêu cầu, phúc lợi                | Cao        | FR04         |
| FR06 | Việc làm       | Tìm kiếm và lọc việc làm | Tìm kiếm và lọc công việc theo tên, vị trí, lương, địa điểm, ngành nghề | Cao        | FR04         |

## Tính năng dành cho Ứng viên

| ID   | Nhóm tính năng | Tính năng                     | Mô tả                                                              | Độ ưu tiên | Dependencies |
| ---- | -------------- | ----------------------------- | ------------------------------------------------------------------ | ---------- | ------------ |
| FR07 | Hồ sơ ứng viên | Quản lý CV và kỹ năng         | Tạo CV trực tuyến, upload file CV, quản lý danh sách kỹ năng       | Cao        | FR03         |
| FR08 | Ứng tuyển      | Nộp đơn ứng tuyển             | Gửi đơn ứng tuyển kèm CV cho các vị trí công việc                  | Cao        | FR05, FR07   |
| FR09 | Ứng tuyển      | Theo dõi trạng thái ứng tuyển | Xem trạng thái đơn ứng tuyển (đã gửi, đang xem xét, từ chối, nhận) | Cao        | FR08         |
| FR10 | Ứng tuyển      | Lưu công việc yêu thích       | Lưu các công việc quan tâm để xem lại sau                          | Trung bình | FR05         |

## Tính năng dành cho Nhà tuyển dụng

| ID   | Nhóm tính năng         | Tính năng                 | Mô tả                                                             | Độ ưu tiên | Dependencies |
| ---- | ---------------------- | ------------------------- | ----------------------------------------------------------------- | ---------- | ------------ |
| FR11 | Hồ sơ công ty          | Quản lý thông tin công ty | Tạo và cập nhật hồ sơ công ty, logo, hình ảnh môi trường làm việc | Cao        | FR03         |
| FR12 | Quản lý tin tuyển dụng | Quản lý tin tuyển dụng    | Đăng, chỉnh sửa, xóa/ẩn, gia hạn tin tuyển dụng                   | Cao        | FR11         |
| FR13 | Quản lý ứng viên       | Xem và quản lý ứng viên   | Xem danh sách, hồ sơ ứng viên và cập nhật trạng thái ứng tuyển    | Cao        | FR08, FR12   |
| FR14 | Quản lý ứng viên       | Tìm kiếm ứng viên         | Tìm kiếm ứng viên theo kỹ năng, kinh nghiệm, địa điểm             | Trung bình | FR07         |
| FR15 | Liên lạc               | Gửi tin nhắn cho ứng viên | Gửi tin nhắn trực tiếp cho ứng viên về cơ hội việc làm            | Trung bình | FR13         |

## Tính năng dành cho Admin

| ID   | Nhóm tính năng         | Tính năng           | Mô tả                                                    | Độ ưu tiên | Dependencies |
| ---- | ---------------------- | ------------------- | -------------------------------------------------------- | ---------- | ------------ |
| FR16 | Quản lý người dùng     | Quản lý tài khoản   | Xem, tìm kiếm, khóa/mở khóa tài khoản người dùng         | Cao        | FR02         |
| FR17 | Quản lý công ty        | Quản lý công ty     | Xem, duyệt, chỉnh sửa, xóa thông tin công ty             | Cao        | FR11         |
| FR18 | Quản lý tin tuyển dụng | Kiểm duyệt việc làm | Xem, duyệt, ẩn/hiện tất cả tin tuyển dụng từ mọi công ty | Cao        | FR12         |
| FR19 | Quản lý dữ liệu        | Quản lý danh mục    | Thêm, sửa, xóa ngành nghề, kỹ năng, địa điểm             | Trung bình | FR06, FR07   |
| FR20 | Thống kê tổng quan     | Dashboard admin     | Xem các chỉ số cơ bản: số user, công ty, job, ứng tuyển  | Trung bình | FR16-FR19    |
