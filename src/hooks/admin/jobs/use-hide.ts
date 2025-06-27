"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hideJob } from "@/actions/admin/jobs";

/**
 * Hook để ẩn việc làm (admin)
 */
export function useHideJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: hideJob,
    onSuccess: () => {
      // Invalidate jobs list to refresh data
      queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] });
      
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard", "stats"] });
      
      // Invalidate general jobs data
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (error) => {
      console.error("Error hiding job:", error);
    },
  });
} 