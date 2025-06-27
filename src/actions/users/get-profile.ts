"use server";

import { createClient } from "@/lib/supabase/server";
import { getUserProfileSchema, type GetUserProfileInput } from "@/lib/validations";
import { USER_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";
import type { UserProfile } from "@/types/custom.types";

type Result = 
  | { success: true; data: UserProfile }
  | { success: false; error: string };

export async function getUserProfile(params?: GetUserProfileInput): Promise<Result> {
  try {
    // 1. Validate input
    const data = getUserProfileSchema.parse(params || {});
    
    // 2. Get current user
    const currentUser = await requireAuth();
    
    // 3. Determine which user profile to fetch
    const targetUserId = data.userId || currentUser.id;
    
    // 4. Create Supabase client
    const supabase = await createClient();

    // 5. Fetch user profile with related data
    const { data: profile, error } = await supabase
      .from("users")
      .select(`
        *,
        user_skills (
          *,
          skills (*)
        ),
        cvs (*),
        company_members (
          *,
          companies (*)
        )
      `)
      .eq("id", targetUserId)
      .single();

    if (error) {
      console.error("Get profile error:", error);
      return { success: false, error: USER_ERRORS.PROFILE_NOT_FOUND };
    }

    if (!profile) {
      return { success: false, error: USER_ERRORS.PROFILE_NOT_FOUND };
    }

    return {
      success: true,
      data: profile as UserProfile,
    };
  } catch (error) {
    console.error("Get profile error:", error);
    
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }

    return { success: false, error: GENERIC_ERRORS.SOMETHING_WENT_WRONG };
  }
} 