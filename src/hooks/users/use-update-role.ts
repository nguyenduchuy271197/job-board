"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserRole } from "@/actions/users/update-role";
import type { UpdateRoleInput } from "@/lib/validations";

export function useUpdateRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateRoleInput) => updateUserRole(data),
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