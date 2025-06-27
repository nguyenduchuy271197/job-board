import { useQuery } from "@tanstack/react-query";
import { getJobApplications } from "@/actions/applications/get-job-applications";
import type { GetJobApplicationsInput } from "@/lib/validations/schemas/application.schema";

export function useJobApplications(
  input: GetJobApplicationsInput,
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: ["applications", "job", input.job_id, input],
    queryFn: async () => {
      const result = await getJobApplications(input);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 3, // 3 minutes (shorter than user applications since this changes more frequently)
    enabled: options?.enabled !== false && !!input.job_id,
  });
} 