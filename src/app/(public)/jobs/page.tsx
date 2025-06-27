import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Loading } from "@/components/shared/loading";
import { JobList } from "./_components/job-list";
import { JobFilters } from "./_components/job-filters";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tìm việc làm | Jobboard",
  description:
    "Khám phá hàng ngàn cơ hội việc làm hấp dẫn tại Việt Nam. Tìm kiếm theo địa điểm, mức lương, kinh nghiệm và nhiều tiêu chí khác.",
  keywords: [
    "tìm việc làm",
    "việc làm",
    "tuyển dụng",
    "cơ hội nghề nghiệp",
    "việt nam",
    "job search",
  ],
  openGraph: {
    title: "Tìm việc làm | Jobboard",
    description:
      "Khám phá hàng ngàn cơ hội việc làm hấp dẫn tại Việt Nam. Tìm kiếm theo địa điểm, mức lương, kinh nghiệm và nhiều tiêu chí khác.",
    type: "website",
  },
};

export default function JobsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <PageHeader
        title="Tìm việc làm"
        description="Khám phá hàng ngàn cơ hội việc làm phù hợp với bạn"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <JobFilters />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Suspense fallback={<Loading variant="card" />}>
            <JobList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
