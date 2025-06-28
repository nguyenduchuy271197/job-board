"use client";

import { useQuery } from "@tanstack/react-query";
import { getLocations } from "@/actions/master-data";
import type { GetLocationsInput } from "@/actions/master-data/get-locations";

/**
 * Hook để lấy danh sách địa điểm (public)
 * @param params - Tham số tìm kiếm và sắp xếp
 */
export function useLocations(params: Partial<GetLocationsInput> = {}) {
  const defaultParams: GetLocationsInput = {
    sort_by: params.sort_by ?? "name",
    sort_order: params.sort_order ?? "asc",
    ...params,
  };

  return useQuery({
    queryKey: ["master-data", "locations", defaultParams],
    queryFn: () => getLocations(defaultParams),
    staleTime: 10 * 60 * 1000, // 10 minutes (master data rarely changes)
    retry: 2,
  });
} 