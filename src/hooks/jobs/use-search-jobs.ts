"use client";

import { useQuery } from "@tanstack/react-query";
import { searchJobs } from "@/actions/jobs";
import type { SearchJobsInput } from "@/lib/validations/schemas/job.schema";

/**
 * Hook để tìm kiếm công việc với bộ lọc nâng cao
 * @param params - Tham số tìm kiếm và bộ lọc
 */
export function useSearchJobs(params: SearchJobsInput) {
  return useQuery({
    queryKey: ["search-jobs", params],
    queryFn: () => searchJobs(params),
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter than regular jobs list)
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error?.message?.includes("authentication") || error?.message?.includes("unauthorized")) {
        return false;
      }
      return failureCount < 2;
    },
    enabled: !!(params.query || params.location || params.employment_type || params.experience_level || params.company_id), // Only search if at least one filter is provided
  });
} 