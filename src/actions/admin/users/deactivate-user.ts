"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { deactivateUserSchema, type DeactivateUserInput } from "@/lib/validations/schemas/admin.schema";
import { ADMIN_ERRORS, GENERIC_ERRORS, USER_ERRORS } from "@/constants/error-messages";

/**
 * Vô hiệu hóa tài khoản người dùng (chỉ dành cho admin)
 * @param input - Thông tin người dùng cần vô hiệu hóa
 * @returns Promise<{ success: boolean; error?: string }>
 */
export async function deactivateUser(input: DeactivateUserInput) {
  try {
    // Validate input
    const validatedInput = deactivateUserSchema.parse(input);

    // Require admin authentication
    const admin = await requireAdmin();

    // Prevent admin from deactivating themselves
    if (admin.id === validatedInput.user_id) {
      return {
        success: false,
        error: "Không thể vô hiệu hóa tài khoản của chính mình",
      };
    }

    const supabase = await createClient();

    // Check if user exists and is active
    const { data: user, error: getUserError } = await supabase
      .from("users")
      .select("id, role, is_active")
      .eq("id", validatedInput.user_id)
      .single();

    if (getUserError || !user) {
      return {
        success: false,
        error: USER_ERRORS.PROFILE_NOT_FOUND,
      };
    }

    if (!user.is_active) {
      return {
        success: false,
        error: "Người dùng đã bị vô hiệu hóa trước đó",
      };
    }

    // Prevent deactivating other admins
    if (user.role === "admin") {
      return {
        success: false,
        error: "Không thể vô hiệu hóa tài khoản admin khác",
      };
    }

    // Deactivate user
    const { error: updateError } = await supabase
      .from("users")
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq("id", validatedInput.user_id);

    if (updateError) {
      console.error("Error deactivating user:", updateError);
      return {
        success: false,
        error: ADMIN_ERRORS.USER_DEACTIVATION_FAILED,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error in deactivateUser:", error);
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG,
    };
  }
} 