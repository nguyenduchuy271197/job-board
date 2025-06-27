"use client";

import { useState } from "react";
import { useSavedJobs } from "@/hooks/saved-jobs";
import { SavedJobFilters } from "./saved-job-filters";
import { SavedJobsList } from "./saved-jobs-list";
import { EmptySavedJobs } from "./empty-saved-jobs";
import { Loading } from "@/components/shared/loading";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export interface SavedJobFilterState {
  search: string;
  location: string;
  employment_type:
    | "all"
    | "full_time"
    | "part_time"
    | "contract"
    | "internship"
    | "freelance";
  experience_level:
    | "all"
    | "entry"
    | "junior"
    | "mid"
    | "senior"
    | "lead"
    | "executive";
  salary_min: number | undefined;
  salary_max: number | undefined;
  sort_by: "created_at" | "job_title" | "company_name";
  sort_order: "asc" | "desc";
  page: number;
  limit: number;
}

export function SavedJobsManagement() {
  const [filters, setFilters] = useState<SavedJobFilterState>({
    search: "",
    location: "",
    employment_type: "all",
    experience_level: "all",
    salary_min: undefined,
    salary_max: undefined,
    sort_by: "created_at",
    sort_order: "desc",
    page: 1,
    limit: 10,
  });

  // Build query parameters excluding "all" values
  const queryParams = {
    ...filters,
    employment_type:
      filters.employment_type === "all"
        ? undefined
        : (filters.employment_type as
            | "full_time"
            | "part_time"
            | "contract"
            | "internship"
            | "freelance"),
    experience_level:
      filters.experience_level === "all"
        ? undefined
        : (filters.experience_level as
            | "entry"
            | "junior"
            | "mid"
            | "senior"
            | "lead"
            | "executive"),
    search: filters.search || undefined,
    location: filters.location || undefined,
  };

  const {
    data: savedJobsData,
    isLoading,
    error,
    refetch,
  } = useSavedJobs(queryParams);

  const handleFilterChange = (newFilters: Partial<SavedJobFilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 when filters change (except for page change)
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      location: "",
      employment_type: "all",
      experience_level: "all",
      salary_min: undefined,
      salary_max: undefined,
      sort_by: "created_at",
      sort_order: "desc",
      page: 1,
      limit: 10,
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Có lỗi xảy ra khi tải danh sách việc làm đã lưu. Vui lòng thử lại sau.
          <button
            onClick={() => refetch()}
            className="ml-2 underline hover:no-underline"
          >
            Thử lại
          </button>
        </AlertDescription>
      </Alert>
    );
  }

  const savedJobs = savedJobsData?.saved_jobs || [];
  const hasJobs = savedJobs.length > 0;

  return (
    <div className="space-y-6">
      <SavedJobFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        resultsCount={savedJobsData?.total || 0}
      />

      {hasJobs ? (
        <SavedJobsList
          savedJobs={savedJobs}
          pagination={{
            page: savedJobsData?.page || 1,
            limit: savedJobsData?.limit || 10,
            total: savedJobsData?.total || 0,
            has_next: savedJobsData?.has_next || false,
            has_previous: savedJobsData?.has_previous || false,
          }}
          onPageChange={(page) => handleFilterChange({ page })}
        />
      ) : (
        <EmptySavedJobs
          hasFilters={
            filters.search !== "" ||
            filters.location !== "" ||
            filters.employment_type !== "all" ||
            filters.experience_level !== "all" ||
            filters.salary_min !== undefined ||
            filters.salary_max !== undefined
          }
        />
      )}
    </div>
  );
}
