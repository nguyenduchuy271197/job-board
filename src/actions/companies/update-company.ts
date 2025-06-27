"use server";

import { createClient } from "@/lib/supabase/server";
import { updateCompanySchema, type UpdateCompanyInput } from "@/lib/validations/schemas/company.schema";
import { COMPANY_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";
import { requireEmployer } from "@/lib/auth";
import type { Company } from "@/types/custom.types";

/**
 * Cập nhật thông tin công ty (chỉ dành cho thành viên công ty)
 * @param input - Thông tin công ty cần cập nhật
 * @returns Promise<{ success: boolean; data?: Company; error?: string }>
 */
export async function updateCompany(input: UpdateCompanyInput) {
  try {
    // Validate input
    const validatedInput = updateCompanySchema.parse(input);

    // Check if user is employer
    const user = await requireEmployer();

    const supabase = await createClient();

    // Check if user is a member of the company
    const { data: membership, error: memberError } = await supabase
      .from("company_members")
      .select("id, role")
      .eq("company_id", validatedInput.id)
      .eq("user_id", user.id)
      .single();

    if (memberError || !membership) {
      return {
        success: false,
        error: COMPANY_ERRORS.NOT_COMPANY_MEMBER,
      };
    }

    // Get existing company data
    const { data: existingCompany, error: fetchError } = await supabase
      .from("companies")
      .select("*")
      .eq("id", validatedInput.id)
      .single();

    if (fetchError || !existingCompany) {
      return {
        success: false,
        error: COMPANY_ERRORS.COMPANY_NOT_FOUND,
      };
    }

    // Prepare update data - only include fields that are provided
    const updateData: Record<string, unknown> = {};
    
    if (validatedInput.name !== undefined) {
      updateData.name = validatedInput.name;
    }
    if (validatedInput.description !== undefined) {
      updateData.description = validatedInput.description || null;
    }
    if (validatedInput.website !== undefined) {
      updateData.website = validatedInput.website || null;
    }
    if (validatedInput.logo_url !== undefined) {
      updateData.logo_url = validatedInput.logo_url || null;
    }
    if (validatedInput.industry !== undefined) {
      updateData.industry = validatedInput.industry || null;
    }
    if (validatedInput.location !== undefined) {
      updateData.location = validatedInput.location || null;
    }
    if (validatedInput.email !== undefined) {
      updateData.email = validatedInput.email || null;
    }

    // Only update if there are changes
    if (Object.keys(updateData).length === 0) {
      return {
        success: true,
        data: existingCompany as Company,
      };
    }

    // Update the company
    const { data: updatedCompany, error: updateError } = await supabase
      .from("companies")
      .update(updateData)
      .eq("id", validatedInput.id)
      .select()
      .single();

    if (updateError || !updatedCompany) {
      console.error("Error updating company:", updateError);
      return {
        success: false,
        error: COMPANY_ERRORS.COMPANY_UPDATE_FAILED,
      };
    }

    return {
      success: true,
      data: updatedCompany as Company,
    };
  } catch (error) {
    console.error("Error in updateCompany:", error);
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG,
    };
  }
} 