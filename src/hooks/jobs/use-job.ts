"use client";

import { useQuery } from "@tanstack/react-query";
import { getJobDetails } from "@/actions/jobs";
import type { GetJobDetailsInput } from "@/lib/validations/schemas/job.schema";

/**
 * Hook để lấy chi tiết công việc theo ID
 * @param params - Job ID
 */
export function useJob(params: GetJobDetailsInput) {
  return useQuery({
    queryKey: ["job", params.id],
    queryFn: () => getJobDetails(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on authentication errors or not found errors
      if (
        error?.message?.includes("authentication") ||
        error?.message?.includes("unauthorized") ||
        error?.message?.includes("not found")
      ) {
        return false;
      }
      return failureCount < 2;
    },
    enabled: !!params.id, // Only run query if job ID is provided
  });
} 