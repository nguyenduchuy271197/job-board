"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteJob } from "@/actions/jobs";
import { toast } from "sonner";

/**
 * Hook để xóa công việc
 */
export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJob,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Xóa công việc thành công");
        
        // Invalidate and refetch job-related queries
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        queryClient.invalidateQueries({ queryKey: ["search-jobs"] });
        queryClient.invalidateQueries({ queryKey: ["company-jobs"] });
      } else {
        toast.error(result.error || "Xóa công việc thất bại");
      }
    },
    onError: (error) => {
      console.error("Error deleting job:", error);
      toast.error("Đã có lỗi xảy ra khi xóa công việc");
    },
  });
} 