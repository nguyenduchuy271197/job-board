import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { saveJob } from "@/actions/saved-jobs";
import { type SaveJobInput } from "@/lib/validations/schemas/saved-job.schema";

export function useSaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SaveJobInput) => {
      const result = await saveJob(params);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    },
    onSuccess: () => {
      // Invalidate saved jobs queries
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      
      toast.success("Đã lưu việc làm thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi lưu việc làm");
    },
  });
} 