import { requireEmployer } from "@/lib/auth";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { JobsManagement } from "./_components/jobs-management";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý tin tuyển dụng | Jobboard",
  description:
    "Đăng tin tuyển dụng, chỉnh sửa và theo dõi hiệu quả. Quản lý toàn bộ tin tuyển dụng của công ty bạn.",
  keywords: [
    "quản lý tin tuyển dụng",
    "đăng tin",
    "tuyển dụng",
    "employer",
    "job posting",
  ],
  openGraph: {
    title: "Quản lý tin tuyển dụng | Jobboard",
    description:
      "Đăng tin tuyển dụng, chỉnh sửa và theo dõi hiệu quả. Quản lý toàn bộ tin tuyển dụng của công ty bạn.",
    type: "website",
  },
};

export default async function EmployerJobsPage() {
  // Require employer authentication
  await requireEmployer();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý việc làm"
        description="Đăng tin tuyển dụng, chỉnh sửa và theo dõi hiệu quả"
        action={
          <Button asChild>
            <Link href="/employer/jobs/create">
              <Plus className="mr-2 h-4 w-4" />
              Đăng tin mới
            </Link>
          </Button>
        }
      />
      <JobsManagement />
    </div>
  );
}
