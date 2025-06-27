"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { approveCompanySchema, type ApproveCompanyInput } from "@/lib/validations/schemas/admin.schema";
import { ADMIN_ERRORS, GENERIC_ERRORS, COMPANY_ERRORS } from "@/constants/error-messages";

/**
 * Phê duyệt xác minh công ty (chỉ dành cho admin)
 * @param input - Thông tin công ty cần phê duyệt
 * @returns Promise<{ success: boolean; error?: string }>
 */
export async function approveCompany(input: ApproveCompanyInput) {
  try {
    // Validate input
    const validatedInput = approveCompanySchema.parse(input);

    // Require admin authentication
    await requireAdmin();

    const supabase = await createClient();

    // Check if company exists
    const { data: company, error: getCompanyError } = await supabase
      .from("companies")
      .select("id, name, verified")
      .eq("id", validatedInput.company_id)
      .single();

    if (getCompanyError || !company) {
      return {
        success: false,
        error: COMPANY_ERRORS.COMPANY_NOT_FOUND,
      };
    }

    if (company.verified) {
      return {
        success: false,
        error: "Công ty đã được xác minh trước đó",
      };
    }

    // Approve company
    const { error: updateError } = await supabase
      .from("companies")
      .update({ 
        verified: true,
        updated_at: new Date().toISOString()
      })
      .eq("id", validatedInput.company_id);

    if (updateError) {
      console.error("Error approving company:", updateError);
      return {
        success: false,
        error: ADMIN_ERRORS.APPROVAL_FAILED,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error in approveCompany:", error);
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG,
    };
  }
} 