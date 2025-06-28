"use client";

import { useQuery } from "@tanstack/react-query";
import { getIndustries } from "@/actions/master-data";
import type { GetIndustriesInput } from "@/actions/master-data/get-industries";

/**
 * Hook để lấy danh sách ngành nghề (public)
 * @param params - Tham số tìm kiếm và sắp xếp
 */
export function useIndustries(params: Partial<GetIndustriesInput> = {}) {
  const defaultParams: GetIndustriesInput = {
    sort_by: params.sort_by ?? "name",
    sort_order: params.sort_order ?? "asc",
    ...params,
  };

  return useQuery({
    queryKey: ["master-data", "industries", defaultParams],
    queryFn: () => getIndustries(defaultParams),
    staleTime: 10 * 60 * 1000, // 10 minutes (master data rarely changes)
    retry: 2,
  });
} 