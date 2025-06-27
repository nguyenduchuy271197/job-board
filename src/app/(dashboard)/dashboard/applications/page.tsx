import { requireCandidate } from "@/lib/auth";
import { PageHeader } from "@/components/shared/page-header";
import ApplicationsManagement from "./_components/applications-management";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đơn ứng tuyển | Jobboard",
  description:
    "Quản lý và theo dõi trạng thái các đơn ứng tuyển của bạn. Xem kết quả phỏng vấn và cập nhật thông tin.",
  keywords: [
    "đơn ứng tuyển",
    "applications",
    "phỏng vấn",
    "trạng thái",
    "tuyển dụng",
  ],
  openGraph: {
    title: "Đơn ứng tuyển | Jobboard",
    description:
      "Quản lý và theo dõi trạng thái các đơn ứng tuyển của bạn. Xem kết quả phỏng vấn và cập nhật thông tin.",
    type: "website",
  },
};

export default async function ApplicationsPage() {
  await requireCandidate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Đơn ứng tuyển"
        description="Quản lý và theo dõi trạng thái các đơn ứng tuyển của bạn"
      />
      <ApplicationsManagement />
    </div>
  );
}
