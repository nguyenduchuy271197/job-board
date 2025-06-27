import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteCV } from "@/actions/cvs/delete-cv";
import type { DeleteCVInput } from "@/lib/validations/schemas/cv.schema";

export function useDeleteCV() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteCVInput) => deleteCV(input),
    onSuccess: (result, variables) => {
      if (result.success) {
        // Show success notification
        toast.success("Xóa CV thành công");
        
        // Invalidate and refetch CV-related queries
        queryClient.invalidateQueries({ 
          queryKey: ["cvs"] 
        });
        
        // Invalidate user profile queries that might include CV info
        queryClient.invalidateQueries({ 
          queryKey: ["users", "profile"] 
        });

        // Remove the specific CV from cache if it exists
        queryClient.setQueryData(
          ["cvs", "user", "current"],
          (oldData: unknown) => {
            if (Array.isArray(oldData)) {
              return oldData.filter((cv: { id: string }) => cv.id !== variables.cv_id);
            }
            return oldData;
          }
        );
      } else {
        // Show error notification
        toast.error(result.error);
      }
    },
    onError: (error: Error) => {
      console.error("CV deletion error:", error);
      toast.error("Xóa CV thất bại");
    },
  });
} 