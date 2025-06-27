"use server";

import { createClient } from "@/lib/supabase/server";
import { deactivateUserSchema, type DeactivateUserInput } from "@/lib/validations";
import { USER_ERRORS, ADMIN_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";
import type { User } from "@/types/custom.types";

type Result = 
  | { success: true; data: User }
  | { success: false; error: string };

export async function deactivateUser(params: DeactivateUserInput): Promise<Result> {
  try {
    // 1. Validate input
    const data = deactivateUserSchema.parse(params);
    
    // 2. Require admin authentication
    const admin = await requireAdmin();
    
    // 3. Create Supabase client
    const supabase = await createClient();

    // 4. Check if target user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("id, role, is_active")
      .eq("id", data.userId)
      .single();

    if (fetchError || !existingUser) {
      return { success: false, error: USER_ERRORS.PROFILE_NOT_FOUND };
    }

    // 5. Prevent deactivating own account
    if (data.userId === admin.id) {
      return { success: false, error: "Không thể vô hiệu hóa tài khoản của chính mình" };
    }

    // 6. Prevent deactivating other admins
    if (existingUser.role === "admin") {
      return { success: false, error: "Không thể vô hiệu hóa tài khoản admin khác" };
    }

    // 7. Check if already deactivated
    if (!existingUser.is_active) {
      return { success: false, error: "Tài khoản đã bị vô hiệu hóa" };
    }

    // 8. Deactivate user
    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ 
        is_active: false,
        deactivated_at: new Date().toISOString(),
        deactivation_reason: data.reason,
      })
      .eq("id", data.userId)
      .select()
      .single();

    if (updateError) {
      console.error("User deactivation error:", updateError);
      return { success: false, error: ADMIN_ERRORS.USER_DEACTIVATION_FAILED };
    }

    // 9. Sign out the deactivated user from all sessions
    // Note: In a real implementation, you might want to add user session management

    return { success: true, data: updatedUser };
  } catch (error) {
    console.error("Deactivate user error:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || ADMIN_ERRORS.USER_DEACTIVATION_FAILED,
      };
    }

    return { success: false, error: GENERIC_ERRORS.SOMETHING_WENT_WRONG };
  }
} 