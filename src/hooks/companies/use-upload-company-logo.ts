"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadCompanyLogo } from "@/actions/companies";
import { toast } from "sonner";

/**
 * Hook để tải logo công ty lên
 */
export function useUploadCompanyLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadCompanyLogo,
    onSuccess: (result, variables) => {
      if (result.success) {
        toast.success("Tải logo thành công");
        
        // Get company_id from FormData
        const companyId = variables.get("company_id") as string;
        
        // Invalidate and refetch company-related queries
        queryClient.invalidateQueries({ queryKey: ["company"] });
        queryClient.invalidateQueries({ queryKey: ["companies"] });
        if (companyId) {
          queryClient.invalidateQueries({ queryKey: ["company", { id: companyId }] });
        }
        
        // Also invalidate jobs since company logo affects job listings
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        queryClient.invalidateQueries({ queryKey: ["company-jobs"] });
      } else {
        toast.error(result.error || "Tải logo thất bại");
      }
    },
    onError: (error) => {
      console.error("Upload company logo error:", error);
      toast.error("Tải logo thất bại");
    },
  });
} 