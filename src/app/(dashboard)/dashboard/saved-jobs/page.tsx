import { requireCandidate } from "@/lib/auth";
import { PageHeader } from "@/components/shared/page-header";
import { SavedJobsManagement } from "./_components/saved-jobs-management";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Việc làm đã lưu | Jobboard",
  description:
    "Quản lý các việc làm bạn đã lưu để theo dõi và ứng tuyển sau. Tổ chức và sắp xếp cơ hội nghề nghiệp của bạn.",
  keywords: [
    "việc làm đã lưu",
    "saved jobs",
    "bookmark",
    "theo dõi",
    "ứng tuyển",
  ],
  openGraph: {
    title: "Việc làm đã lưu | Jobboard",
    description:
      "Quản lý các việc làm bạn đã lưu để theo dõi và ứng tuyển sau. Tổ chức và sắp xếp cơ hội nghề nghiệp của bạn.",
    type: "website",
  },
};

export default async function SavedJobsPage() {
  await requireCandidate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Việc làm đã lưu"
        description="Quản lý các việc làm bạn đã lưu để theo dõi và ứng tuyển sau"
      />
      <SavedJobsManagement />
    </div>
  );
}
