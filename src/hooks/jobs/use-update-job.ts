"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateJob } from "@/actions/jobs";
import { toast } from "sonner";

/**
 * Hook để cập nhật thông tin công việc
 */
export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateJob,
    onSuccess: (result, variables) => {
      if (result.success) {
        toast.success("Cập nhật công việc thành công");
        
        // Invalidate and refetch job-related queries
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        queryClient.invalidateQueries({ queryKey: ["search-jobs"] });
        queryClient.invalidateQueries({ queryKey: ["company-jobs"] });
        queryClient.invalidateQueries({ queryKey: ["job", variables.id] });
      } else {
        toast.error(result.error || "Cập nhật công việc thất bại");
      }
    },
    onError: (error) => {
      console.error("Error updating job:", error);
      toast.error("Đã có lỗi xảy ra khi cập nhật công việc");
    },
  });
} 