"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuth, isCompanyMember } from "@/lib/auth";
import { updateApplicationStatusSchema, type UpdateApplicationStatusInput } from "@/lib/validations/schemas/application.schema";
import { APPLICATION_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";
import type { Application } from "@/types/custom.types";

type Result = 
  | { success: true; data: Application }
  | { success: false; error: string };

export async function updateApplicationStatus(input: UpdateApplicationStatusInput): Promise<Result> {
  try {
    // 1. Validate input
    const validatedData = updateApplicationStatusSchema.parse(input);
    
    // 2. Authenticate user
    const user = await requireAuth();

    const supabase = await createClient();

    // 3. Get application details including job and company info
    const { data: application, error: applicationError } = await supabase
      .from("applications")
      .select(`
        *,
        jobs!inner(
          id,
          company_id,
          title,
          status
        )
      `)
      .eq("id", validatedData.application_id)
      .single();

    if (applicationError || !application) {
      return { 
        success: false, 
        error: APPLICATION_ERRORS.APPLICATION_NOT_FOUND 
      };
    }

    // 4. Check permissions based on user role and action
    if (user.role === "candidate") {
      // Candidates can only withdraw their own applications
      if (application.candidate_id !== user.id) {
        return { 
          success: false, 
          error: APPLICATION_ERRORS.NOT_APPLICATION_OWNER 
        };
      }
      
      // Candidates can only set status to 'withdrawn'
      if (validatedData.status !== "withdrawn") {
        return { 
          success: false, 
          error: "Ứng viên chỉ có thể rút đơn ứng tuyển" 
        };
      }
      
      // Can't withdraw if already processed
      if (["offer", "rejected"].includes(application.status)) {
        return { 
          success: false, 
          error: APPLICATION_ERRORS.CANNOT_WITHDRAW 
        };
      }
      
    } else if (user.role === "employer") {
      // Employers can only update applications for their company's jobs
      const isMember = await isCompanyMember(application.jobs.company_id);
      if (!isMember) {
        return { 
          success: false, 
          error: APPLICATION_ERRORS.CANNOT_VIEW_APPLICATION 
        };
      }
      
      // Employers cannot update withdrawn applications
      if (application.status === "withdrawn") {
        return { 
          success: false, 
          error: "Không thể cập nhật đơn ứng tuyển đã rút" 
        };
      }
      
    } else if (user.role === "admin") {
      // Admins can update any application status
    } else {
      return { 
        success: false, 
        error: GENERIC_ERRORS.UNAUTHORIZED 
      };
    }

    // 5. Validate status transition
    const validTransitions: Record<string, string[]> = {
      "submitted": ["reviewing", "rejected", "withdrawn"],
      "reviewing": ["interview", "offer", "rejected", "withdrawn"],
      "interview": ["offer", "rejected", "withdrawn"],
      "offer": ["rejected"], // Can only reject an offer, not withdraw
      "rejected": [], // Final state
      "withdrawn": [], // Final state
    };

    const allowedNextStatuses = validTransitions[application.status] || [];
    
    if (!allowedNextStatuses.includes(validatedData.status as string)) {
      return { 
        success: false, 
        error: APPLICATION_ERRORS.INVALID_STATUS_TRANSITION 
      };
    }

    // 6. Update application status
    const updateData: Record<string, unknown> = {
      status: validatedData.status,
      updated_at: new Date().toISOString(),
    };

    // Add notes if provided
    if (validatedData.notes) {
      updateData.notes = validatedData.notes;
    }

    const { data: updatedApplication, error: updateError } = await supabase
      .from("applications")
      .update(updateData)
      .eq("id", validatedData.application_id)
      .select()
      .single();

    if (updateError) {
      console.error("Update application status error:", updateError);
      return { 
        success: false, 
        error: APPLICATION_ERRORS.STATUS_UPDATE_FAILED 
      };
    }

    return { 
      success: true, 
      data: updatedApplication 
    };
    
  } catch (error) {
    console.error("Update application status error:", error);
    
    if (error instanceof Error && error.message.includes("violates row-level security")) {
      return { 
        success: false, 
        error: APPLICATION_ERRORS.STATUS_UPDATE_FAILED 
      };
    }
    
    return { 
      success: false, 
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG 
    };
  }
} 