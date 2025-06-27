"use client";

import { useQuery } from "@tanstack/react-query";
import { getCompanyJobs } from "@/actions/jobs";
import type { GetCompanyJobsInput } from "@/lib/validations/schemas/job.schema";

/**
 * Hook để lấy danh sách công việc của một công ty
 * @param params - Company ID và tham số phân trang
 */
export function useCompanyJobs(params: GetCompanyJobsInput) {
  return useQuery({
    queryKey: ["company-jobs", params],
    queryFn: () => getCompanyJobs(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error?.message?.includes("authentication") || error?.message?.includes("unauthorized")) {
        return false;
      }
      return failureCount < 2;
    },
    enabled: !!params.company_id, // Only run query if company ID is provided
  });
} 