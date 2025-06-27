import { useQuery } from "@tanstack/react-query";
import { getSavedJobs } from "@/actions/saved-jobs";
import { type GetSavedJobsInput } from "@/lib/validations/schemas/saved-job.schema";

export function useSavedJobs(params: Partial<GetSavedJobsInput> = {}) {
  return useQuery({
    queryKey: ["saved-jobs", params],
    queryFn: async () => {
      const result = await getSavedJobs(params);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
} 