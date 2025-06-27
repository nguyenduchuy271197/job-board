"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { getUserCVsSchema, type GetUserCVsInput } from "@/lib/validations/schemas/cv.schema";
import { GENERIC_ERRORS } from "@/constants/error-messages";
import type { CV } from "@/types/custom.types";

type Result = 
  | { success: true; data: CV[] }
  | { success: false; error: string };

export async function getUserCVs(input: GetUserCVsInput = {}): Promise<Result> {
  try {
    // 1. Validate input
    const validatedData = getUserCVsSchema.parse(input);
    
    // 2. Authenticate user
    const user = await requireAuth();
    
    // 3. Determine target user ID
    const targetUserId = validatedData.user_id || user.id;
    
    // 4. Check permissions - users can only view their own CVs unless they're employers/admins
    if (targetUserId !== user.id) {
      if (user.role === "candidate") {
        return {
          success: false,
          error: "Bạn không được phép xem CV của người khác"
        };
      }
    }
    
    // 5. Get Supabase client
    const supabase = await createClient();
    
    // 6. Fetch user CVs
    const { data: cvs, error } = await supabase
      .from("cvs")
      .select("*")
      .eq("user_id", targetUserId)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user CVs:", error);
      return {
        success: false,
        error: GENERIC_ERRORS.SOMETHING_WENT_WRONG
      };
    }

    return {
      success: true,
      data: cvs || []
    };

  } catch (error) {
    console.error("Error in getUserCVs:", error);
    
    if (error instanceof Error && error.message.includes("redirect")) {
      throw error; // Re-throw redirect errors
    }
    
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG
    };
  }
} 