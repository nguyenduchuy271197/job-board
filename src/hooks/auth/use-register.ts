"use client";

import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/actions/auth/register";
import type { RegisterInput } from "@/lib/validations";

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterInput) => registerUser(data),
  });
} 