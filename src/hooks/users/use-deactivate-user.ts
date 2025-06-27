"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deactivateUser } from "@/actions/users/deactivate-user";
import type { DeactivateUserInput } from "@/lib/validations";

export function useDeactivateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: DeactivateUserInput) => deactivateUser(data),
    onSuccess: (result) => {
      if (result.success) {
        // Invalidate user lists and specific user queries
        queryClient.invalidateQueries({ queryKey: ["users"] });
        queryClient.invalidateQueries({ queryKey: ["profile", result.data.id] });
        queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      }
    },
  });
} 