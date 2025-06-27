import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Loading } from "@/components/shared/loading";
import { ApplicationsManagement } from "./_components/applications-management";
import { PAGE_TITLES } from "@/constants/labels";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đơn ứng tuyển | Jobboard",
  description:
    "Quản lý ứng viên và theo dõi trạng thái ứng tuyển. Xem hồ sơ ứng viên và đưa ra quyết định tuyển dụng.",
  keywords: [
    "đơn ứng tuyển",
    "quản lý ứng viên",
    "applications",
    "nhà tuyển dụng",
    "tuyển dụng",
  ],
  openGraph: {
    title: "Đơn ứng tuyển | Jobboard",
    description:
      "Quản lý ứng viên và theo dõi trạng thái ứng tuyển. Xem hồ sơ ứng viên và đưa ra quyết định tuyển dụng.",
    type: "website",
  },
};

export default function EmployerApplicationsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title={PAGE_TITLES.applications}
        description="Quản lý ứng viên và theo dõi trạng thái ứng tuyển"
      />

      <Suspense fallback={<Loading />}>
        <ApplicationsManagement />
      </Suspense>
    </div>
  );
}
