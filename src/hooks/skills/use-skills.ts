import { useQuery } from "@tanstack/react-query";
import { getSkills } from "@/actions/skills/get-skills";
import type { GetSkillsInput } from "@/lib/validations/schemas/skill.schema";

export function useSkills(
  input: GetSkillsInput = {},
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: ["skills", "all", input],
    queryFn: async () => {
      const result = await getSkills(input);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes (skills don't change often)
    enabled: options?.enabled !== false,
  });
} 