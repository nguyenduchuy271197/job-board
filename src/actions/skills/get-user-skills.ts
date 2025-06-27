"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { getUserSkillsSchema, type GetUserSkillsInput } from "@/lib/validations/schemas/skill.schema";
import { GENERIC_ERRORS } from "@/constants/error-messages";
import type { UserSkill, Skill } from "@/types/custom.types";

type UserSkillWithSkill = UserSkill & {
  skills: Skill;
};

type Result = 
  | { success: true; data: UserSkillWithSkill[] }
  | { success: false; error: string };

export async function getUserSkills(input: GetUserSkillsInput = {}): Promise<Result> {
  try {
    // 1. Validate input
    const validatedData = getUserSkillsSchema.parse(input);
    
    // 2. Authenticate user
    const user = await requireAuth();
    
    // 3. Determine target user ID
    const targetUserId = validatedData.user_id || user.id;
    
    // 4. Check permissions - users can view their own skills, employers/admins can view others
    if (targetUserId !== user.id) {
      if (user.role === "candidate") {
        return {
          success: false,
          error: "Bạn không được phép xem kỹ năng của người khác"
        };
      }
    }
    
    // 5. Get Supabase client
    const supabase = await createClient();
    
    // 6. Fetch user skills with skill details
    const { data: userSkills, error } = await supabase
      .from("user_skills")
      .select(`
        *,
        skills (
          id,
          name,
          category,
          description
        )
      `)
      .eq("user_id", targetUserId)
      .order("proficiency_level", { ascending: false })
      .order("years_experience", { ascending: false });

    if (error) {
      console.error("Error fetching user skills:", error);
      return {
        success: false,
        error: GENERIC_ERRORS.SOMETHING_WENT_WRONG
      };
    }

    // 7. Type assertion for the joined data
    const typedUserSkills = userSkills as UserSkillWithSkill[];

    return {
      success: true,
      data: typedUserSkills || []
    };

  } catch (error) {
    console.error("Error in getUserSkills:", error);
    
    if (error instanceof Error && error.message.includes("redirect")) {
      throw error; // Re-throw redirect errors
    }
    
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG
    };
  }
} 