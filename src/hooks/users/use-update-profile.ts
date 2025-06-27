"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "@/actions/users/update-profile";
import type { UpdateProfileInput } from "@/lib/validations";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateProfileInput) => updateUserProfile(data),
    onSuccess: (result) => {
      if (result.success) {
        // Invalidate and refetch profile data
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
    },
  });
} 