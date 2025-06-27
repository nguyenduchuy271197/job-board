"use server";

import { createClient } from "@/lib/supabase/server";
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/validations";
import { USER_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";
import type { User } from "@/types/custom.types";

type Result = 
  | { success: true; data: User }
  | { success: false; error: string };

export async function updateUserProfile(params: UpdateProfileInput): Promise<Result> {
  try {
    // 1. Validate input
    const data = updateProfileSchema.parse(params);
    
    // 2. Require authentication
    const user = await requireAuth();
    
    // 3. Create Supabase client
    const supabase = await createClient();

    // 4. Prepare update data (only include non-empty fields)
    const updateData: Record<string, string | null | undefined> = {};
    
    if (data.fullName !== undefined) updateData.full_name = data.fullName;
    if (data.phone !== undefined && data.phone !== "") updateData.phone = data.phone;
    if (data.location !== undefined && data.location !== "") updateData.location = data.location;
    if (data.bio !== undefined && data.bio !== "") updateData.bio = data.bio;
    if (data.linkedinUrl !== undefined && data.linkedinUrl !== "") updateData.linkedin_url = data.linkedinUrl;
    if (data.portfolioUrl !== undefined && data.portfolioUrl !== "") updateData.portfolio_url = data.portfolioUrl;

    // Set empty strings to null for optional fields
    if (data.phone === "") updateData.phone = null;
    if (data.location === "") updateData.location = null;
    if (data.bio === "") updateData.bio = null;
    if (data.linkedinUrl === "") updateData.linkedin_url = null;
    if (data.portfolioUrl === "") updateData.portfolio_url = null;

    // 5. Update user profile
    const { data: updatedUser, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", user.id)
      .select("*")
      .single();

    if (error) {
      console.error("Update profile error:", error);
      return { success: false, error: USER_ERRORS.PROFILE_UPDATE_FAILED };
    }

    if (!updatedUser) {
      return { success: false, error: USER_ERRORS.PROFILE_UPDATE_FAILED };
    }

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error) {
    console.error("Update profile error:", error);
    
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }

    return { success: false, error: GENERIC_ERRORS.SOMETHING_WENT_WRONG };
  }
} 