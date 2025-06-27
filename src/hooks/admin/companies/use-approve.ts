"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveCompany } from "@/actions/admin/companies";

/**
 * Hook để phê duyệt công ty (admin)
 */
export function useApproveCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveCompany,
    onSuccess: () => {
      // Invalidate companies list to refresh data
      queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
      
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard", "stats"] });
      
      // Invalidate general companies data
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: (error) => {
      console.error("Error approving company:", error);
    },
  });
} 