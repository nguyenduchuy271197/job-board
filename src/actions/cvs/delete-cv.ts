"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { deleteCVSchema, type DeleteCVInput } from "@/lib/validations/schemas/cv.schema";
import { CV_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";

type Result = 
  | { success: true; data: { id: string } }
  | { success: false; error: string };

export async function deleteCV(input: DeleteCVInput): Promise<Result> {
  try {
    // 1. Validate input
    const validatedData = deleteCVSchema.parse(input);
    
    // 2. Authenticate user
    const user = await requireAuth();
    
    if (user.role !== "candidate") {
      return {
        success: false,
        error: "Chỉ ứng viên mới có thể xóa CV"
      };
    }
    
    // 3. Get Supabase client
    const supabase = await createClient();
    
    // 4. Get CV details to verify ownership and get file path
    const { data: cv, error: fetchError } = await supabase
      .from("cvs")
      .select("*")
      .eq("id", validatedData.cv_id)
      .eq("user_id", user.id) // Ensure user owns the CV
      .single();

    if (fetchError || !cv) {
      return {
        success: false,
        error: CV_ERRORS.CV_NOT_FOUND
      };
    }

    // 5. Check if this is the primary CV
    const wasPrimary = cv.is_primary;

    // 6. Delete file from storage
    if (cv.file_url) {
      // Extract file path from URL
      const filePath = cv.file_url.split('/').pop();
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from("resumes")
          .remove([`${user.id}/${filePath}`]);

        if (storageError) {
          console.error("Error deleting CV file from storage:", storageError);
          // Continue with database deletion even if storage deletion fails
        }
      }
    }

    // 7. Delete CV record from database
    const { error: deleteError } = await supabase
      .from("cvs")
      .delete()
      .eq("id", validatedData.cv_id)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Error deleting CV record:", deleteError);
      return {
        success: false,
        error: CV_ERRORS.CV_DELETE_FAILED
      };
    }

    // 8. If the deleted CV was primary, set another CV as primary
    if (wasPrimary) {
      const { data: remainingCVs, error: remainingError } = await supabase
        .from("cvs")
        .select("id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!remainingError && remainingCVs && remainingCVs.length > 0) {
        await supabase
          .from("cvs")
          .update({ is_primary: true })
          .eq("id", remainingCVs[0].id);
      }
    }

    return {
      success: true,
      data: { id: validatedData.cv_id }
    };

  } catch (error) {
    console.error("Error in deleteCV:", error);
    
    if (error instanceof Error && error.message.includes("redirect")) {
      throw error; // Re-throw redirect errors
    }
    
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG
    };
  }
} 