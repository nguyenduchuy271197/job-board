"use client";

import { useJobs } from "@/hooks/jobs/use-jobs";
import { JobCard } from "../../_components/job-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";

interface RelatedJobsProps {
  jobSlug: string;
}

export function RelatedJobs({ jobSlug }: RelatedJobsProps) {
  const { data: result, isPending } = useJobs({ page: 1, limit: 6 });

  if (isPending || !result?.success || !result.data) {
    return null;
  }

  // Filter out the current job and take first 3 as related
  const relatedJobs = result.data
    .filter((job) => job.slug !== jobSlug)
    .slice(0, 3);

  if (relatedJobs.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5" />
            <span>Việc làm liên quan</span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/jobs" className="flex items-center space-x-1">
              <span>Xem tất cả</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {relatedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
