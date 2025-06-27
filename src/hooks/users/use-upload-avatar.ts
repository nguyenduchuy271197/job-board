"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadAvatar } from "@/actions/users/upload-avatar";

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: FormData) => uploadAvatar(formData),
    onSuccess: (result) => {
      if (result.success) {
        // Invalidate and refetch profile and user data
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
    },
  });
} 