import { requireEmployer } from "@/lib/auth";
import { PageHeader } from "@/components/shared/page-header";
import { JobForm } from "../_components/job-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng tin tuyển dụng | Jobboard",
  description:
    "Tạo tin tuyển dụng mới để tìm kiếm ứng viên phù hợp. Đăng tin tuyển dụng hiệu quả và thu hút ứng viên chất lượng.",
  keywords: [
    "đăng tin tuyển dụng",
    "tạo tin mới",
    "job posting",
    "tuyển dụng",
    "nhà tuyển dụng",
  ],
  openGraph: {
    title: "Đăng tin tuyển dụng | Jobboard",
    description:
      "Tạo tin tuyển dụng mới để tìm kiếm ứng viên phù hợp. Đăng tin tuyển dụng hiệu quả và thu hút ứng viên chất lượng.",
    type: "website",
  },
};

export default async function CreateJobPage() {
  // Require employer authentication
  await requireEmployer();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Đăng tin tuyển dụng"
        description="Tạo tin tuyển dụng mới để tìm kiếm ứng viên phù hợp"
      />
      <JobForm />
    </div>
  );
}
