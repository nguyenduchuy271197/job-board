import { PageHeader } from "@/components/shared/page-header";
import { CompaniesManagement } from "./_components/companies-management";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý công ty | Jobboard",
  description:
    "Xem, kiểm duyệt và quản lý các công ty đăng ký trên nền tảng. Duyệt hồ sơ công ty và phê duyệt tuyển dụng.",
  keywords: [
    "quản lý công ty",
    "admin",
    "kiểm duyệt công ty",
    "doanh nghiệp",
    "company management",
  ],
  openGraph: {
    title: "Quản lý công ty | Jobboard",
    description:
      "Xem, kiểm duyệt và quản lý các công ty đăng ký trên nền tảng. Duyệt hồ sơ công ty và phê duyệt tuyển dụng.",
    type: "website",
  },
};

export default function AdminCompaniesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý công ty"
        description="Xem, duyệt và quản lý thông tin công ty trong hệ thống"
      />

      <CompaniesManagement />
    </div>
  );
}
