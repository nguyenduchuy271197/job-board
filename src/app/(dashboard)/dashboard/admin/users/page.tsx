import { PageHeader } from "@/components/shared/page-header";
import { UsersManagement } from "./_components/users-management";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý người dùng | Jobboard",
  description:
    "Xem, tìm kiếm và quản lý tài khoản người dùng trong hệ thống. Kiểm duyệt và vô hiệu hóa tài khoản khi cần thiết.",
  keywords: [
    "quản lý người dùng",
    "admin",
    "tài khoản",
    "kiểm duyệt",
    "user management",
  ],
  openGraph: {
    title: "Quản lý người dùng | Jobboard",
    description:
      "Xem, tìm kiếm và quản lý tài khoản người dùng trong hệ thống. Kiểm duyệt và vô hiệu hóa tài khoản khi cần thiết.",
    type: "website",
  },
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý người dùng"
        description="Xem, tìm kiếm và quản lý tài khoản người dùng trong hệ thống"
      />

      <UsersManagement />
    </div>
  );
}
