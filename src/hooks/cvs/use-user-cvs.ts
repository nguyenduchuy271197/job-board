import { useQuery } from "@tanstack/react-query";
import { getUserCVs } from "@/actions/cvs/get-user-cvs";
import type { GetUserCVsInput } from "@/lib/validations/schemas/cv.schema";

export function useUserCVs(
  input: GetUserCVsInput = {},
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: ["cvs", "user", input.user_id || "current"],
    queryFn: async () => {
      const result = await getUserCVs(input);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: options?.enabled !== false,
  });
} 