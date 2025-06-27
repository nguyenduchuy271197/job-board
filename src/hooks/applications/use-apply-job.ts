import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { applyForJob } from "@/actions/applications/apply-job";
import { NOTIFICATIONS } from "@/constants/labels";
import type { ApplyJobInput } from "@/lib/validations/schemas/application.schema";

export function useApplyJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ApplyJobInput) => applyForJob(input),
    onSuccess: (result, variables) => {
      if (result.success) {
        // Show success notification
        toast.success(NOTIFICATIONS.application_submitted);
        
        // Invalidate and refetch related queries
        queryClient.invalidateQueries({ 
          queryKey: ["applications", "user"] 
        });
        
        // Invalidate specific job applications if needed
        queryClient.invalidateQueries({ 
          queryKey: ["applications", "job", variables.job_id] 
        });
        
        // Invalidate job details to update application status
        queryClient.invalidateQueries({ 
          queryKey: ["job", variables.job_id] 
        });
      } else {
        // Show error notification
        toast.error(result.error);
      }
    },
    onError: (error) => {
      console.error("Apply job error:", error);
      toast.error("Đã có lỗi xảy ra khi ứng tuyển");
    },
  });
} 