"use server";

import { createClient } from "@/lib/supabase/server";
import { deleteJobSchema, type DeleteJobInput } from "@/lib/validations/schemas/job.schema";
import { JOB_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";
import { requireEmployer } from "@/lib/auth";

/**
 * Xóa công việc (chỉ dành cho thành viên công ty)
 * @param input - Job ID cần xóa
 * @returns Promise<{ success: boolean; error?: string }>
 */
export async function deleteJob(input: DeleteJobInput) {
  try {
    // Validate input
    const validatedInput = deleteJobSchema.parse(input);

    // Check if user is employer
    const user = await requireEmployer();

    const supabase = await createClient();

    // Get existing job and verify user has access
    const { data: existingJob, error: fetchError } = await supabase
      .from("jobs")
      .select(`
        id,
        title,
        status,
        application_count,
        companies!inner (
          company_members!inner (
            user_id
          )
        )
      `)
      .eq("id", validatedInput.id)
      .eq("companies.company_members.user_id", user.id)
      .single();

    if (fetchError || !existingJob) {
      console.error("Error fetching job or access denied:", fetchError);
      return {
        success: false,
        error: JOB_ERRORS.JOB_NOT_FOUND,
      };
    }

    // Check if job has applications - don't allow deletion if it has applications
    if (existingJob.application_count > 0) {
      return {
        success: false,
        error: "Không thể xóa công việc đã có người ứng tuyển",
      };
    }

    // Delete job skills first (due to foreign key constraint)
    const { error: deleteSkillsError } = await supabase
      .from("job_skills")
      .delete()
      .eq("job_id", validatedInput.id);

    if (deleteSkillsError) {
      console.error("Error deleting job skills:", deleteSkillsError);
      return {
        success: false,
        error: JOB_ERRORS.JOB_DELETE_FAILED,
      };
    }

    // Delete saved jobs (due to foreign key constraint)
    const { error: deleteSavedJobsError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", validatedInput.id);

    if (deleteSavedJobsError) {
      console.error("Error deleting saved jobs:", deleteSavedJobsError);
      return {
        success: false,
        error: JOB_ERRORS.JOB_DELETE_FAILED,
      };
    }

    // Delete the job
    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", validatedInput.id);

    if (error) {
      console.error("Error deleting job:", error);
      return {
        success: false,
        error: JOB_ERRORS.JOB_DELETE_FAILED,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error in deleteJob:", error);
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG,
    };
  }
} 