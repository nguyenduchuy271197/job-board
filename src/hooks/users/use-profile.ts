"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/actions/users/get-profile";
import type { GetUserProfileInput } from "@/lib/validations";

export function useProfile(params?: GetUserProfileInput) {
  return useQuery({
    queryKey: ["profile", params?.userId],
    queryFn: () => getUserProfile(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error && typeof error === "object" && "error" in error) {
        const errorMessage = (error as { error: string }).error;
        if (errorMessage.includes("không có quyền") || errorMessage.includes("đăng nhập")) {
          return false;
        }
      }
      return failureCount < 3;
    },
  });
} 