"use client";

import { notFound } from "next/navigation";
import { useJobBySlug } from "@/hooks/jobs/use-job-by-slug";
import { Loading } from "@/components/shared/loading";
import { JobApplyDialog } from "./job-apply-dialog";
import { JobDetailsHeader } from "./job-details-header";
import { JobDetailsContent } from "./job-details-content";
import { JobDetailsSidebar } from "./job-details-sidebar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface JobDetailsProps {
  jobSlug: string;
}

export function JobDetails({ jobSlug }: JobDetailsProps) {
  const { data: result, isPending, error } = useJobBySlug(jobSlug);

  if (isPending) {
    return <Loading />;
  }

  if (error || !result?.success) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Có lỗi xảy ra khi tải thông tin việc làm. Vui lòng thử lại sau.
        </AlertDescription>
      </Alert>
    );
  }

  if (!result.data) {
    notFound();
  }

  const job = result.data;

  return (
    <div className="space-y-8">
      <JobDetailsHeader job={job} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <JobDetailsContent job={job} />
        </div>

        <div className="lg:col-span-1">
          <JobDetailsSidebar job={job} />
        </div>
      </div>

      <JobApplyDialog job={job} />
    </div>
  );
}
