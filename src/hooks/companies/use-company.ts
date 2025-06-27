"use client";

import { useQuery } from "@tanstack/react-query";
import { getCompanyDetails } from "@/actions/companies";
import type { GetCompanyInput } from "@/lib/validations/schemas/company.schema";

/**
 * Hook để lấy chi tiết công ty theo ID hoặc slug
 * @param params - Company ID hoặc slug
 */
export function useCompany(params: GetCompanyInput) {
  return useQuery({
    queryKey: ["company", params],
    queryFn: () => getCompanyDetails(params),
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
    enabled: !!(params.id || params.slug), // Only run query if ID or slug is provided
  });
} 