import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { unsaveJob } from "@/actions/saved-jobs";
import { type UnsaveJobInput } from "@/lib/validations/schemas/saved-job.schema";

export function useUnsaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UnsaveJobInput) => {
      const result = await unsaveJob(params);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.message;
    },
    onSuccess: (message) => {
      // Invalidate saved jobs queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      
      toast.success(message || "Đã bỏ lưu việc làm thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi bỏ lưu việc làm");
    },
  });
} 