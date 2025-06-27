"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/actions/admin/dashboard";
import type { GetDashboardStatsInput } from "@/lib/validations/schemas/admin.schema";

/**
 * Hook để lấy thống kê dashboard (admin)
 * @param params - Tham số thời gian và chu kỳ
 */
export function useStats(params: Partial<GetDashboardStatsInput> = {}) {
  const defaultParams: GetDashboardStatsInput = {
    period: params.period ?? "month",
    ...params,
  };

  return useQuery({
    queryKey: ["admin", "dashboard", "stats", defaultParams],
    queryFn: () => getDashboardStats(defaultParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error?.message?.includes("authentication") || error?.message?.includes("unauthorized")) {
        return false;
      }
      return failureCount < 2;
    },
  });
}