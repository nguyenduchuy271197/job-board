"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth";
import { unsaveJobSchema, type UnsaveJobInput } from "@/lib/validations/schemas/saved-job.schema";
import { SAVED_JOB_ERRORS } from "@/constants/error-messages";

type Result = 
  | { success: true; message: string }
  | { success: false; error: string };

export async function unsaveJob(params: UnsaveJobInput): Promise<Result> {
  try {
    // 1. Validate input
    const { job_id } = unsaveJobSchema.parse(params);

    // 2. Check authentication
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "Vui lòng đăng nhập để bỏ lưu việc làm" };
    }

    // 3. Get database client
    const supabase = await createClient();

    // 4. Check if job is saved by the user
    const { data: savedJob, error: checkError } = await supabase
      .from("saved_jobs")
      .select("id")
      .eq("job_id", job_id)
      .eq("user_id", userId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking saved job:", checkError);
      return { success: false, error: "Không thể kiểm tra trạng thái lưu việc làm" };
    }

    if (!savedJob) {
      return { success: false, error: SAVED_JOB_ERRORS.JOB_NOT_SAVED };
    }

    // 5. Remove the saved job
    const { error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("id", savedJob.id);

    if (deleteError) {
      console.error("Error unsaving job:", deleteError);
      return { success: false, error: SAVED_JOB_ERRORS.UNSAVE_JOB_FAILED };
    }

    return { success: true, message: "Đã bỏ lưu việc làm thành công" };

  } catch (error) {
    console.error("Error in unsaveJob:", error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: "Đã có lỗi xảy ra khi bỏ lưu việc làm" };
  }
} 