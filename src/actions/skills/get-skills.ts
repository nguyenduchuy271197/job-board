"use server";

import { createClient } from "@/lib/supabase/server";
import { getSkillsSchema, type GetSkillsInput } from "@/lib/validations/schemas/skill.schema";
import { GENERIC_ERRORS } from "@/constants/error-messages";
import type { Skill } from "@/types/custom.types";

type SkillSearchResult = {
  skills: Skill[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_previous: boolean;
};

type Result = 
  | { success: true; data: SkillSearchResult }
  | { success: false; error: string };

export async function getSkills(input: GetSkillsInput = {}): Promise<Result> {
  try {
    // 1. Validate input
    const validatedData = getSkillsSchema.parse(input);
    
    // 2. Set pagination defaults
    const page = Number(validatedData.page ?? 1);
    const limit = Number(validatedData.limit ?? 50);
    const offset = (page - 1) * limit;
    
    // 3. Get Supabase client
    const supabase = await createClient();
    
    // 4. Build query for skills
    let query = supabase
      .from("skills")
      .select("*");

    // 5. Apply category filter
    if (validatedData.category) {
      query = query.eq("category", validatedData.category);
    }

    // 6. Apply search filter
    if (validatedData.search) {
      query = query.ilike("name", `%${validatedData.search}%`);
    }

    // 7. Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from("skills")
      .select("*", { count: "exact", head: true })
      .eq("category", validatedData.category || "")
      .ilike("name", validatedData.search ? `%${validatedData.search}%` : "%");

    if (countError) {
      console.error("Error counting skills:", countError);
    }

    // 8. Apply pagination and sorting
    query = query
      .order("name", { ascending: true })
      .range(offset, offset + limit - 1);

    // 9. Execute query
    const { data: skills, error } = await query;

    if (error) {
      console.error("Error fetching skills:", error);
      return {
        success: false,
        error: GENERIC_ERRORS.SOMETHING_WENT_WRONG
      };
    }

    // 10. Calculate pagination info
    const total = totalCount || 0;
    const has_next = offset + limit < total;
    const has_previous = page > 1;

    return {
      success: true,
      data: {
        skills: skills || [],
        total,
        page,
        limit,
        has_next,
        has_previous,
      }
    };

  } catch (error) {
    console.error("Error in getSkills:", error);
    
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG
    };
  }
} 