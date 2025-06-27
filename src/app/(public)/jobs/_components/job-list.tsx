"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useSearchJobs } from "@/hooks/jobs/use-search-jobs";
import { useJobs } from "@/hooks/jobs/use-jobs";

import { JobCard } from "./job-card";
import { JobListPagination } from "./job-list-pagination";
import { JobSort } from "./job-sort";
import { AlertCircle, Briefcase } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function JobList() {
  const searchParams = useSearchParams();

  // Build search filters from URL params
  const filters = useMemo(
    () => ({
      query: searchParams.get("query") || "",
      location: searchParams.get("location") || "",
      employment_type: searchParams.get("employment_type") || "",
      experience_level: searchParams.get("experience_level") || "",
      salary_min: searchParams.get("salary_min")
        ? parseInt(searchParams.get("salary_min")!)
        : undefined,
      salary_max: searchParams.get("salary_max")
        ? parseInt(searchParams.get("salary_max")!)
        : undefined,
      is_remote: searchParams.get("is_remote") === "true",
      sort_by:
        (searchParams.get("sort_by") as
          | "created_at"
          | "published_at"
          | "application_count"
          | "salary_min") || "created_at",
      sort_order: (searchParams.get("sort_order") as "asc" | "desc") || "desc",
      page: parseInt(searchParams.get("page") || "1"),
      limit: 20,
    }),
    [searchParams]
  );

  // Determine if we should use search or regular job listing
  const hasFilters = !!(
    filters.query ||
    filters.location ||
    (filters.employment_type && filters.employment_type !== "all") ||
    (filters.experience_level && filters.experience_level !== "all") ||
    filters.salary_min ||
    filters.salary_max ||
    searchParams.get("is_remote") === "true"
  );

  // Use search hook if filters are present, otherwise use regular jobs hook
  const searchFilters = {
    query: filters.query || undefined,
    location: filters.location || undefined,
    employment_type: (filters.employment_type &&
    filters.employment_type !== "all"
      ? filters.employment_type
      : undefined) as
      | "full_time"
      | "part_time"
      | "contract"
      | "internship"
      | "freelance"
      | undefined,
    experience_level: (filters.experience_level &&
    filters.experience_level !== "all"
      ? filters.experience_level
      : undefined) as
      | "entry"
      | "junior"
      | "mid"
      | "senior"
      | "lead"
      | "executive"
      | undefined,
    salary_min: filters.salary_min,
    salary_max: filters.salary_max,
    is_remote: searchParams.get("is_remote") === "true" ? true : undefined,
    sort_by: filters.sort_by,
    sort_order: filters.sort_order,
    page: filters.page,
    limit: filters.limit,
  };

  const {
    data: searchResult,
    isPending: searchPending,
    error: searchError,
  } = useSearchJobs(searchFilters);

  const {
    data: jobsResult,
    isPending: jobsPending,
    error: jobsError,
  } = useJobs({
    page: filters.page,
    limit: 20,
  });

  const result = hasFilters ? searchResult : jobsResult;
  const isPending = hasFilters ? searchPending : jobsPending;
  const error = hasFilters ? searchError : jobsError;

  if (isPending) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error || !result?.success) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Có lỗi xảy ra khi tải danh sách việc làm. Vui lòng thử lại sau.
        </AlertDescription>
      </Alert>
    );
  }

  const jobs = Array.isArray(result.data) ? result.data : [];
  const total = "total" in result ? result.total : 0;
  const totalPages = Math.ceil(total / 20);

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Không tìm thấy việc làm</h3>
        <p className="text-muted-foreground mb-4">
          Không có việc làm nào phù hợp với tiêu chí tìm kiếm của bạn.
        </p>
        <Button asChild>
          <Link href="/jobs">Xem tất cả việc làm</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">
            {jobs.length > 0 && (
              <span>
                Tìm thấy {jobs.length} việc làm
                {filters.query && (
                  <span> cho &ldquo;{filters.query}&rdquo;</span>
                )}
              </span>
            )}
          </h2>
          {filters.location && (
            <p className="text-muted-foreground">tại {filters.location}</p>
          )}
        </div>

        <JobSort />
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <JobListPagination currentPage={filters.page} totalPages={totalPages} />
      )}
    </div>
  );
}
