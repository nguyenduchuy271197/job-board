"use client";

import { useQuery } from "@tanstack/react-query";
import { getJobBySlug } from "@/actions/jobs/get-job-by-slug";

/**
 * Hook để lấy chi tiết công việc theo slug
 * @param slug - Job slug
 */
export function useJobBySlug(slug: string) {
  return useQuery({
    queryKey: ["job", "slug", slug],
    queryFn: () => getJobBySlug(slug),
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
    enabled: !!slug, // Only run query if slug is provided
  });
}