"use client";

import { useQuery } from "@tanstack/react-query";
import { getJobs } from "@/actions/jobs";
import type { GetJobsInput } from "@/lib/validations/schemas/job.schema";

/**
 * Hook để lấy danh sách công việc với phân trang
 * @param params - Tham số truy vấn và phân trang
 */
export function useJobs(params: Partial<GetJobsInput> = {}) {
  const defaultParams: GetJobsInput = {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    ...params,
  };
  return useQuery({
    queryKey: ["jobs", defaultParams],
    queryFn: () => getJobs(defaultParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error?.message?.includes("authentication") || error?.message?.includes("unauthorized")) {
        return false;
      }
      return failureCount < 2;
    },
  });
} 