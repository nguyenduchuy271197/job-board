"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveJob } from "@/actions/admin/jobs";

/**
 * Hook để phê duyệt việc làm (admin)
 */
export function useApproveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveJob,
    onSuccess: () => {
      // Invalidate jobs list to refresh data
      queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] });
      
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard", "stats"] });
      
      // Invalidate general jobs data
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (error) => {
      console.error("Error approving job:", error);
    },
  });
} 