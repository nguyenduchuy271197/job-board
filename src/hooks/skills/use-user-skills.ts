import { useQuery } from "@tanstack/react-query";
import { getUserSkills } from "@/actions/skills/get-user-skills";
import type { GetUserSkillsInput } from "@/lib/validations/schemas/skill.schema";

export function useUserSkills(
  input: GetUserSkillsInput = {},
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: ["skills", "user", input.user_id || "current"],
    queryFn: async () => {
      const result = await getUserSkills(input);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: options?.enabled !== false,
  });
} 