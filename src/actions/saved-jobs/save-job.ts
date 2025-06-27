"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth";
import { saveJobSchema, type SaveJobInput } from "@/lib/validations/schemas/saved-job.schema";
import { type SavedJob } from "@/types/custom.types";
import { SAVED_JOB_ERRORS, JOB_ERRORS } from "@/constants/error-messages";

type Result = 
  | { success: true; data: SavedJob }
  | { success: false; error: string };

export async function saveJob(params: SaveJobInput): Promise<Result> {
  try {
    // 1. Validate input
    const { job_id } = saveJobSchema.parse(params);

    // 2. Check authentication
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "Vui lòng đăng nhập để lưu việc làm" };
    }

    // 3. Get database client
    const supabase = await createClient();

    // 4. Verify job exists and is published
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("id, status")
      .eq("id", job_id)
      .single();

    if (jobError || !job) {
      return { success: false, error: JOB_ERRORS.JOB_NOT_FOUND };
    }

    if (job.status !== "published") {
      return { success: false, error: JOB_ERRORS.JOB_NOT_PUBLISHED };
    }

    // 5. Check if job is already saved
    const { data: existingSave, error: checkError } = await supabase
      .from("saved_jobs")
      .select("id")
      .eq("job_id", job_id)
      .eq("user_id", userId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing saved job:", checkError);
      return { success: false, error: "Không thể kiểm tra trạng thái lưu việc làm" };
    }

    if (existingSave) {
      return { success: false, error: SAVED_JOB_ERRORS.JOB_ALREADY_SAVED };
    }

    // 6. Save the job
    const { data: savedJob, error: saveError } = await supabase
      .from("saved_jobs")
      .insert({
        job_id,
        user_id: userId,
      })
      .select()
      .single();

    if (saveError) {
      console.error("Error saving job:", saveError);
      return { success: false, error: SAVED_JOB_ERRORS.SAVE_JOB_FAILED };
    }

    return { success: true, data: savedJob };

  } catch (error) {
    console.error("Error in saveJob:", error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: "Đã có lỗi xảy ra khi lưu việc làm" };
  }
} 