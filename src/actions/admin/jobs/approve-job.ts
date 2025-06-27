"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { approveJobSchema, type ApproveJobInput } from "@/lib/validations/schemas/admin.schema";
import { ADMIN_ERRORS, GENERIC_ERRORS, JOB_ERRORS } from "@/constants/error-messages";

/**
 * Phê duyệt và công bố việc làm (chỉ dành cho admin)
 * @param input - Thông tin việc làm cần phê duyệt
 * @returns Promise<{ success: boolean; error?: string }>
 */
export async function approveJob(input: ApproveJobInput) {
  try {
    // Validate input
    const validatedInput = approveJobSchema.parse(input);

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

    if (job.status === "published") {
      return {
        success: false,
        error: "Việc làm đã được công bố trước đó",
      };
    }

    // Approve and publish job
    const { error: updateError } = await supabase
      .from("jobs")
      .update({ 
        status: "published",
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", validatedInput.job_id);

    if (updateError) {
      console.error("Error approving job:", updateError);
      return {
        success: false,
        error: ADMIN_ERRORS.APPROVAL_FAILED,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error in approveJob:", error);
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG,
    };
  }
} 