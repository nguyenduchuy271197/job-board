import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadCV } from "@/actions/cvs/upload-cv";

export function useUploadCV() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => uploadCV(formData),
    onSuccess: (result) => {
      if (result.success) {
        // Show success notification
        toast.success("Tải CV thành công");
        
        // Invalidate and refetch CV-related queries
        queryClient.invalidateQueries({ 
          queryKey: ["cvs"] 
        });
        
        // Invalidate user profile queries that might include CV info
        queryClient.invalidateQueries({ 
          queryKey: ["users", "profile"] 
        });
      } else {
        // Show error notification
        toast.error(result.error);
      }
    },
    onError: (error: Error) => {
      console.error("CV upload error:", error);
      toast.error("Tải CV thất bại");
    },
  });
} 