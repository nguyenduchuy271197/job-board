import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateApplicationStatus } from "@/actions/applications/update-status";
import type { UpdateApplicationStatusInput } from "@/lib/validations/schemas/application.schema";

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateApplicationStatusInput) => updateApplicationStatus(input),
    onSuccess: (result, variables) => {
      if (result.success) {
        // Show success notification based on action
        if (variables.status === "withdrawn") {
          toast.success("Đã rút đơn ứng tuyển thành công");
        } else {
          toast.success("Cập nhật trạng thái đơn ứng tuyển thành công");
        }
        
        // Invalidate and refetch all applications queries
        queryClient.invalidateQueries({ 
          queryKey: ["applications"] 
        });
        
        // Invalidate specific application if we had detailed view
        queryClient.invalidateQueries({ 
          queryKey: ["application", variables.application_id] 
        });
        
        // Update the specific query data if possible
        queryClient.setQueryData(
          ["application", variables.application_id],
          result.data
        );
      } else {
        // Show error notification
        toast.error(result.error);
      }
    },
    onError: (error) => {
      console.error("Update application status error:", error);
      toast.error("Đã có lỗi xảy ra khi cập nhật trạng thái");
    },
  });
} 