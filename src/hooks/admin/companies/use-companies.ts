"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllCompanies } from "@/actions/admin/companies";
import type { GetAllCompaniesInput } from "@/lib/validations/schemas/admin.schema";

/**
 * Hook để lấy danh sách tất cả công ty (admin)
 * @param params - Tham số tìm kiếm và phân trang
 */
export function useCompanies(params: Partial<GetAllCompaniesInput> = {}) {
  const defaultParams: GetAllCompaniesInput = {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    sort_by: params.sort_by ?? "created_at",
    sort_order: params.sort_order ?? "desc",
    ...params,
  };

  return useQuery({
    queryKey: ["admin", "companies", defaultParams],
    queryFn: () => getAllCompanies(defaultParams),
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