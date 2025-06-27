import { requireEmployer } from "@/lib/auth";
import { PageHeader } from "@/components/shared/page-header";
import { CompanyManagement } from "./_components/company-management";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thông tin công ty | Jobboard",
  description:
    "Quản lý hồ sơ công ty, logo và thông tin liên hệ. Cập nhật thông tin để thu hút ứng viên chất lượng cao.",
  keywords: [
    "thông tin công ty",
    "hồ sơ công ty",
    "logo",
    "nhà tuyển dụng",
    "employer profile",
  ],
  openGraph: {
    title: "Thông tin công ty | Jobboard",
    description:
      "Quản lý hồ sơ công ty, logo và thông tin liên hệ. Cập nhật thông tin để thu hút ứng viên chất lượng cao.",
    type: "website",
  },
};

export default async function EmployerCompanyPage() {
  // Require employer authentication
  await requireEmployer();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thông tin công ty"
        description="Quản lý hồ sơ công ty, logo và thông tin liên hệ"
      />
      <CompanyManagement />
    </div>
  );
}
