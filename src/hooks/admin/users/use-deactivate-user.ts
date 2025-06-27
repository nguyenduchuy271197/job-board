"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deactivateUser } from "@/actions/admin/users";

/**
 * Hook để vô hiệu hóa người dùng (admin)
 */
export function useDeactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => {
      // Invalidate users list to refresh data
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard", "stats"] });
    },
    onError: (error) => {
      console.error("Error deactivating user:", error);
    },
  });
}