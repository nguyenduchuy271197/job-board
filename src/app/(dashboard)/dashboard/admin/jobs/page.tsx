import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Loading } from "@/components/shared/loading";
import { JobsManagement } from "./_components/jobs-management";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý việc làm | Jobboard",
  description:
    "Kiểm duyệt, phê duyệt và quản lý tất cả tin tuyển dụng trên nền tảng. Ẩn/hiện và kiểm soát chất lượng bài đăng.",
  keywords: [
    "quản lý việc làm",
    "admin",
    "kiểm duyệt tin tuyển dụng",
    "job moderation",
    "phê duyệt",
  ],
  openGraph: {
    title: "Quản lý việc làm | Jobboard",
    description:
      "Kiểm duyệt, phê duyệt và quản lý tất cả tin tuyển dụng trên nền tảng. Ẩn/hiện và kiểm soát chất lượng bài đăng.",
    type: "website",
  },
};

export default function AdminJobsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý việc làm"
        description="Xem, duyệt và quản lý tất cả tin tuyển dụng từ các công ty"
      />

      <Suspense fallback={<Loading />}>
        <JobsManagement />
      </Suspense>
    </div>
  );
}
