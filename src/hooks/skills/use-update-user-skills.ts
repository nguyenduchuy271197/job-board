import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateUserSkills } from "@/actions/skills/update-user-skills";
import type { UpdateUserSkillsInput } from "@/lib/validations/schemas/skill.schema";

export function useUpdateUserSkills() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateUserSkillsInput) => updateUserSkills(input),
    onSuccess: (result) => {
      if (result.success) {
        // Show success notification
        toast.success("Cập nhật kỹ năng thành công");
        
        // Invalidate and refetch skills-related queries
        queryClient.invalidateQueries({ 
          queryKey: ["skills", "user"] 
        });
        
        // Invalidate user profile queries that might include skills info
        queryClient.invalidateQueries({ 
          queryKey: ["users", "profile"] 
        });

        // Update the cache with new data
        queryClient.setQueryData(
          ["skills", "user", "current"],
          result.data
        );
      } else {
        // Show error notification
        toast.error(result.error);
      }
    },
    onError: (error: Error) => {
      console.error("Skills update error:", error);
      toast.error("Cập nhật kỹ năng thất bại");
    },
  });
} 