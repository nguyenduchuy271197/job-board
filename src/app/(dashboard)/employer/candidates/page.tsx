import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Loading } from "@/components/shared/loading";
import { CandidateSearch } from "./_components/candidate-search";
import { PAGE_TITLES } from "@/constants/labels";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tìm kiếm ứng viên | Jobboard",
  description:
    "Tìm kiếm ứng viên theo kỹ năng, kinh nghiệm và địa điểm. Kết nối với nhân tài phù hợp cho doanh nghiệp.",
  keywords: [
    "tìm kiếm ứng viên",
    "candidate search",
    "nhân tài",
    "kỹ năng",
    "tuyển dụng",
  ],
  openGraph: {
    title: "Tìm kiếm ứng viên | Jobboard",
    description:
      "Tìm kiếm ứng viên theo kỹ năng, kinh nghiệm và địa điểm. Kết nối với nhân tài phù hợp cho doanh nghiệp.",
    type: "website",
  },
};

export default function EmployerCandidatesPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title={PAGE_TITLES.candidates || "Tìm kiếm ứng viên"}
        description="Tìm kiếm ứng viên theo kỹ năng, kinh nghiệm và địa điểm"
      />

      <Suspense fallback={<Loading />}>
        <CandidateSearch />
      </Suspense>
    </div>
  );
}
