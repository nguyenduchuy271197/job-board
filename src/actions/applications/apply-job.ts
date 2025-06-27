"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { applyJobSchema, type ApplyJobInput } from "@/lib/validations/schemas/application.schema";
import { APPLICATION_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";
import type { Application } from "@/types/custom.types";

type Result = 
  | { success: true; data: Application }
  | { success: false; error: string };

export async function applyForJob(input: ApplyJobInput): Promise<Result> {
  try {
    // 1. Validate input
    const validatedData = applyJobSchema.parse(input);
    
    // 2. Authenticate user and ensure they are a candidate
    const user = await requireAuth();
    
    if (user.role !== "candidate") {
      return { 
        success: false, 
        error: "Chỉ ứng viên mới có thể ứng tuyển việc làm" 
      };
    }

    const supabase = await createClient();

    // 3. Check if job exists and is published
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("id, status, company_id")
      .eq("id", validatedData.job_id)
      .single();

    if (jobError || !job) {
      return { 
        success: false, 
        error: "Không tìm thấy việc làm" 
      };
    }

    if (job.status !== "published") {
      return { 
        success: false, 
        error: "Việc làm này không còn nhận ứng tuyển" 
      };
    }

    // 4. Check if user has already applied for this job
    const { data: existingApplication } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", validatedData.job_id)
      .eq("candidate_id", user.id)
      .single();

    if (existingApplication) {
      return { 
        success: false, 
        error: APPLICATION_ERRORS.ALREADY_APPLIED 
      };
    }

    // 5. Create the application
    const { data: application, error: applicationError } = await supabase
      .from("applications")
      .insert({
        job_id: validatedData.job_id,
        candidate_id: user.id,
        cover_letter: validatedData.cover_letter || null,
        resume_url: validatedData.resume_url || null,
        notes: validatedData.notes || null,
        status: "submitted",
      })
      .select()
      .single();

    if (applicationError) {
      console.error("Apply job error:", applicationError);
      return { 
        success: false, 
        error: APPLICATION_ERRORS.APPLICATION_FAILED 
      };
    }

    return { 
      success: true, 
      data: application 
    };
    
  } catch (error) {
    console.error("Apply job error:", error);
    
    if (error instanceof Error && error.message.includes("violates row-level security")) {
      return { 
        success: false, 
        error: APPLICATION_ERRORS.APPLICATION_FAILED 
      };
    }
    
    return { 
      success: false, 
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG 
    };
  }
} 