"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllJobs } from "@/actions/admin/jobs";
import type { GetAllJobsInput } from "@/lib/validations/schemas/admin.schema";

/**
 * Hook để lấy danh sách tất cả công việc (admin)
 * @param params - Tham số tìm kiếm và phân trang
 */
export function useJobs(params: Partial<GetAllJobsInput> = {}) {
  const defaultParams: GetAllJobsInput = {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    sort_by: params.sort_by ?? "created_at",
    sort_order: params.sort_order ?? "desc",
    ...params,
  };

  return useQuery({
    queryKey: ["admin", "jobs", defaultParams],
    queryFn: () => getAllJobs(defaultParams),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error?.message?.includes("authentication") || error?.message?.includes("unauthorized")) {
        return false;
      }
      return failureCount < 2;
    },
  });
} 