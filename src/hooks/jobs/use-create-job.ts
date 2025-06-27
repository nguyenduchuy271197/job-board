"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJob } from "@/actions/jobs";
import { NOTIFICATIONS } from "@/constants/labels";
import { toast } from "sonner";

/**
 * Hook để tạo công việc mới
 */
export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,
    onSuccess: (result) => {
      if (result.success) {
        toast.success(NOTIFICATIONS.job_created);
        
        // Invalidate and refetch job-related queries
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        queryClient.invalidateQueries({ queryKey: ["search-jobs"] });
        queryClient.invalidateQueries({ queryKey: ["company-jobs"] });
      } else {
        toast.error(result.error || "Tạo công việc thất bại");
      }
    },
    onError: (error) => {
      console.error("Error creating job:", error);
      toast.error("Đã có lỗi xảy ra khi tạo công việc");
    },
  });
} 