"use server";

import { createClient } from "@/lib/supabase/server";
import { updateRoleSchema, type UpdateRoleInput } from "@/lib/validations";
import { USER_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";
import type { User } from "@/types/custom.types";

type Result = 
  | { success: true; data: User }
  | { success: false; error: string };

export async function updateUserRole(params: UpdateRoleInput): Promise<Result> {
  try {
    // 1. Validate input
    const data = updateRoleSchema.parse(params);
    
    // 2. Require admin authentication
    await requireAdmin();
    
    // 3. Create Supabase client
    const supabase = await createClient();

    // 4. Check if target user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", data.userId)
      .single();

    if (fetchError || !existingUser) {
      return { success: false, error: USER_ERRORS.PROFILE_NOT_FOUND };
    }

    // 5. Prevent changing own role
    const currentAdmin = await requireAdmin();
    if (data.userId === currentAdmin.id) {
      return { success: false, error: "Không thể thay đổi vai trò của chính mình" };
    }

    // 6. Update user role
    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ role: data.role })
      .eq("id", data.userId)
      .select()
      .single();

    if (updateError) {
      console.error("Role update error:", updateError);
      return { success: false, error: USER_ERRORS.ROLE_CHANGE_FAILED };
    }

    return { success: true, data: updatedUser };
  } catch (error) {
    console.error("Update role error:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || USER_ERRORS.ROLE_CHANGE_FAILED,
      };
    }

    return { success: false, error: GENERIC_ERRORS.SOMETHING_WENT_WRONG };
  }
} 