import { useQuery } from "@tanstack/react-query";
import { searchCandidates } from "@/actions/search";
import { type SearchCandidatesInput } from "@/lib/validations/schemas/search.schema";

export function useSearchCandidates(params: Partial<SearchCandidatesInput> = {}) {
  return useQuery({
    queryKey: ["search-candidates", params],
    queryFn: async () => {
      const result = await searchCandidates(params);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - shorter for search results
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!params, // Only run query if params exist
  });
} 