"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCompany } from "@/actions/companies";
import { toast } from "sonner";

/**
 * Hook để cập nhật thông tin công ty
 */
export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCompany,
    onSuccess: (result, variables) => {
      if (result.success) {
        toast.success("Cập nhật công ty thành công");
        
        // Invalidate and refetch company-related queries
        queryClient.invalidateQueries({ queryKey: ["company"] });
        queryClient.invalidateQueries({ queryKey: ["companies"] });
        queryClient.invalidateQueries({ queryKey: ["company", { id: variables.id }] });
        
        // Also invalidate jobs since company info affects job listings
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        queryClient.invalidateQueries({ queryKey: ["company-jobs"] });
      } else {
        toast.error(result.error || "Cập nhật công ty thất bại");
      }
    },
    onError: (error) => {
      console.error("Update company error:", error);
      toast.error("Cập nhật công ty thất bại");
    },
  });
} 