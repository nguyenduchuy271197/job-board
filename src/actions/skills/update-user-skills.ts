"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { updateUserSkillsSchema, type UpdateUserSkillsInput } from "@/lib/validations/schemas/skill.schema";
import { SKILL_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";
import type { UserSkill, Skill } from "@/types/custom.types";

type UserSkillWithSkill = UserSkill & {
  skills: Skill;
};

type Result = 
  | { success: true; data: UserSkillWithSkill[] }
  | { success: false; error: string };

export async function updateUserSkills(input: UpdateUserSkillsInput): Promise<Result> {
  try {
    // 1. Validate input
    const validatedData = updateUserSkillsSchema.parse(input);
    
    // 2. Authenticate user and ensure they are a candidate
    const user = await requireAuth();
    
    if (user.role !== "candidate") {
      return {
        success: false,
        error: "Chỉ ứng viên mới có thể cập nhật kỹ năng"
      };
    }
    
    // 3. Get Supabase client
    const supabase = await createClient();

    // 4. Start transaction - first delete all existing user skills
    const { error: deleteError } = await supabase
      .from("user_skills")
      .delete()
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Error deleting existing user skills:", deleteError);
      return {
        success: false,
        error: SKILL_ERRORS.SKILL_UPDATE_FAILED
      };
    }

    // 5. If no skills provided, return empty array (user cleared all skills)
    if (validatedData.skills.length === 0) {
      return {
        success: true,
        data: []
      };
    }

    // 6. Validate that all skill IDs exist
    const skillIds = validatedData.skills.map(skill => skill.skill_id);
    const { data: existingSkills, error: skillsError } = await supabase
      .from("skills")
      .select("id")
      .in("id", skillIds);

    if (skillsError || !existingSkills || existingSkills.length !== skillIds.length) {
      return {
        success: false,
        error: "Một số kỹ năng được chọn không tồn tại"
      };
    }

    // 7. Insert new user skills
    const userSkillsToInsert = validatedData.skills.map(skill => ({
      user_id: user.id,
      skill_id: skill.skill_id,
      proficiency_level: skill.proficiency_level,
      years_experience: skill.years_experience || null,
    }));

    const { error: insertError } = await supabase
      .from("user_skills")
      .insert(userSkillsToInsert);

    if (insertError) {
      console.error("Error inserting user skills:", insertError);
      return {
        success: false,
        error: SKILL_ERRORS.SKILL_UPDATE_FAILED
      };
    }

    // 8. Fetch updated user skills with skill details
    const { data: updatedUserSkills, error: fetchError } = await supabase
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
      .eq("user_id", user.id)
      .order("proficiency_level", { ascending: false })
      .order("years_experience", { ascending: false });

    if (fetchError) {
      console.error("Error fetching updated user skills:", fetchError);
      return {
        success: false,
        error: GENERIC_ERRORS.SOMETHING_WENT_WRONG
      };
    }

    // 9. Type assertion for the joined data
    const typedUserSkills = updatedUserSkills as UserSkillWithSkill[];

    return {
      success: true,
      data: typedUserSkills || []
    };

  } catch (error) {
    console.error("Error in updateUserSkills:", error);
    
    if (error instanceof Error && error.message.includes("redirect")) {
      throw error; // Re-throw redirect errors
    }
    
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG
    };
  }
} 