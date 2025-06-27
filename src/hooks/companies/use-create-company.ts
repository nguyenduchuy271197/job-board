"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCompany } from "@/actions/companies";
import { toast } from "sonner";

/**
 * Hook để tạo công ty mới
 */
export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCompany,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Tạo công ty thành công");
        
        // Invalidate and refetch company-related queries
        queryClient.invalidateQueries({ queryKey: ["company"] });
        queryClient.invalidateQueries({ queryKey: ["companies"] });
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        queryClient.invalidateQueries({ queryKey: ["company-jobs"] });
      } else {
        toast.error(result.error || "Tạo công ty thất bại");
      }
    },
    onError: (error) => {
      console.error("Create company error:", error);
      toast.error("Tạo công ty thất bại");
    },
  });
} 