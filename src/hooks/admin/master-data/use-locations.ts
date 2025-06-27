"use client";

import { useQuery } from "@tanstack/react-query";
import { getLocations } from "@/actions/admin/master-data";
import type { GetLocationsInput } from "@/lib/validations/schemas/admin.schema";

/**
 * Hook để lấy danh sách địa điểm (admin)
 * @param params - Tham số tìm kiếm và sắp xếp
 */
export function useLocations(params: Partial<GetLocationsInput> = {}) {
  const defaultParams: GetLocationsInput = {
    sort_by: params.sort_by ?? "name",
    sort_order: params.sort_order ?? "asc",
    ...params,
  };

  return useQuery({
    queryKey: ["admin", "master-data", "locations", defaultParams],
    queryFn: () => getLocations(defaultParams),
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