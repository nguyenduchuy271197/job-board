import { requireCandidate } from "@/lib/auth";
import { PageHeader } from "@/components/shared/page-header";
import { CVManagement } from "./_components/cv-management";
import { CVUploadDialog } from "./_components/cv-upload-dialog";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quản lý CV | Jobboard",
  description:
    "Tải lên, quản lý và chọn CV chính cho hồ sơ của bạn. Tối ưu hóa CV để tăng cơ hội được nhà tuyển dụng chọn.",
  keywords: ["CV", "resume", "hồ sơ", "tải lên", "quản lý", "tuyển dụng"],
  openGraph: {
    title: "Quản lý CV | Jobboard",
    description:
      "Tải lên, quản lý và chọn CV chính cho hồ sơ của bạn. Tối ưu hóa CV để tăng cơ hội được nhà tuyển dụng chọn.",
    type: "website",
  },
};

export default async function CVPage() {
  // Chỉ cho phép candidate truy cập
  await requireCandidate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý CV"
        description="Tải lên, quản lý và chọn CV chính cho hồ sơ của bạn"
        action={<CVUploadDialog />}
      />

      <CVManagement />
    </div>
  );
}
