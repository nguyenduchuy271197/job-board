import { useQuery } from "@tanstack/react-query";
import { getUserApplications } from "@/actions/applications/get-user-applications";
import type { GetUserApplicationsInput } from "@/lib/validations/schemas/application.schema";

export function useUserApplications(
  input: GetUserApplicationsInput = {},
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: ["applications", "user", input],
    queryFn: async () => {
      const result = await getUserApplications(input);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: options?.enabled !== false,
  });
} 