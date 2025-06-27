"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "@/actions/auth/login";
import type { LoginInput } from "@/lib/validations";

export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: LoginInput) => loginUser(data),
    onSuccess: () => {
      // Invalidate user-related queries after successful login
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
} 