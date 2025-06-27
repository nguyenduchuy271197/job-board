import { PageHeader } from "@/components/shared/page-header";
import { EmployerOverview } from "./_components/employer-overview";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tổng quan nhà tuyển dụng | Jobboard",
  description:
    "Bảng điều khiển nhà tuyển dụng - Xem thống kê và hoạt động tuyển dụng của công ty. Quản lý ứng viên và tin tuyển dụng.",
  keywords: [
    "nhà tuyển dụng",
    "employer",
    "tuyển dụng",
    "thống kê",
    "quản lý tin tuyển dụng",
  ],
  openGraph: {
    title: "Tổng quan nhà tuyển dụng | Jobboard",
    description:
      "Bảng điều khiển nhà tuyển dụng - Xem thống kê và hoạt động tuyển dụng của công ty. Quản lý ứng viên và tin tuyển dụng.",
    type: "website",
  },
};

export default function EmployerDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tổng quan"
        description="Xem thống kê và hoạt động tuyển dụng của công ty"
      />
      <EmployerOverview />
    </div>
  );
}
