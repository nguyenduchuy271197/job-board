import { requireCandidate } from "@/lib/auth";
import { PageHeader } from "@/components/shared/page-header";
import { SkillsManagement } from "./_components/skills-management";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quản lý kỹ năng | Jobboard",
  description:
    "Cập nhật kỹ năng và mức độ thành thạo để nhà tuyển dụng dễ dàng tìm thấy bạn. Thêm kỹ năng mới và đánh giá năng lực.",
  keywords: [
    "kỹ năng",
    "skills",
    "năng lực",
    "thành thạo",
    "chuyên môn",
    "tuyển dụng",
  ],
  openGraph: {
    title: "Quản lý kỹ năng | Jobboard",
    description:
      "Cập nhật kỹ năng và mức độ thành thạo để nhà tuyển dụng dễ dàng tìm thấy bạn. Thêm kỹ năng mới và đánh giá năng lực.",
    type: "website",
  },
};

export default async function SkillsPage() {
  // Chỉ cho phép candidate truy cập
  await requireCandidate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý kỹ năng"
        description="Cập nhật kỹ năng và mức độ thành thạo để nhà tuyển dụng dễ dàng tìm thấy bạn"
      />

      <SkillsManagement />
    </div>
  );
}
