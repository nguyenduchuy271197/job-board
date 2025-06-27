"use client";

import { useQuery } from "@tanstack/react-query";
import { getIndustries } from "@/actions/admin/master-data";
import type { GetIndustriesInput } from "@/lib/validations/schemas/admin.schema";

/**
 * Hook để lấy danh sách ngành nghề (admin)
 * @param params - Tham số tìm kiếm và sắp xếp
 */
export function useIndustries(params: Partial<GetIndustriesInput> = {}) {
  const defaultParams: GetIndustriesInput = {
    sort_by: params.sort_by ?? "name",
    sort_order: params.sort_order ?? "asc",
    ...params,
  };

  return useQuery({
    queryKey: ["admin", "master-data", "industries", defaultParams],
    queryFn: () => getIndustries(defaultParams),
    staleTime: 10 * 60 * 1000, // 10 minutes (master data rarely changes)
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error?.message?.includes("authentication") || error?.message?.includes("unauthorized")) {
        return false;
      }
      return failureCount < 2;
    },
  });
} 