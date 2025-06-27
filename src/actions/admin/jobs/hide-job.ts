"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { hideJobSchema, type HideJobInput } from "@/lib/validations/schemas/admin.schema";
import { ADMIN_ERRORS, GENERIC_ERRORS, JOB_ERRORS } from "@/constants/error-messages";

/**
 * Ẩn việc làm (chỉ dành cho admin)
 * @param input - Thông tin việc làm cần ẩn
 * @returns Promise<{ success: boolean; error?: string }>
 */
export async function hideJob(input: HideJobInput) {
  try {
    // Validate input
    const validatedInput = hideJobSchema.parse(input);

    // Require admin authentication
    await requireAdmin();

    const supabase = await createClient();

    // Check if job exists
    const { data: job, error: getJobError } = await supabase
      .from("jobs")
      .select("id, title, status")
      .eq("id", validatedInput.job_id)
      .single();

    if (getJobError || !job) {
      return {
        success: false,
        error: JOB_ERRORS.JOB_NOT_FOUND,
      };
    }

    if (job.status === "closed") {
      return {
        success: false,
        error: "Việc làm đã được ẩn trước đó",
      };
    }

    // Hide job by setting status to closed
    const { error: updateError } = await supabase
      .from("jobs")
      .update({ 
        status: "closed",
        updated_at: new Date().toISOString()
      })
      .eq("id", validatedInput.job_id);

    if (updateError) {
      console.error("Error hiding job:", updateError);
      return {
        success: false,
        error: ADMIN_ERRORS.MODERATION_FAILED,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error in hideJob:", error);
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG,
    };
  }
} 