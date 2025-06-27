"use server";

import { createClient } from "@/lib/supabase/server";
import { createCompanySchema, type CreateCompanyInput } from "@/lib/validations/schemas/company.schema";
import { COMPANY_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";
import { requireEmployer } from "@/lib/auth";
import { createSlugFromTitle } from "@/constants/labels";
import type { Company } from "@/types/custom.types";

/**
 * Tạo công ty mới (chỉ dành cho nhà tuyển dụng)
 * @param input - Thông tin công ty cần tạo
 * @returns Promise<{ success: boolean; data?: Company; error?: string }>
 */
export async function createCompany(input: CreateCompanyInput) {
  try {
    // Validate input
    const validatedInput = createCompanySchema.parse(input);

    // Check if user is employer
    const user = await requireEmployer();

    const supabase = await createClient();

    // Generate slug if not provided or ensure uniqueness
    let finalSlug = validatedInput.slug;
    if (!finalSlug) {
      finalSlug = createSlugFromTitle(validatedInput.name);
    }

    // Check if slug already exists
    const { data: existingCompany } = await supabase
      .from("companies")
      .select("id")
      .eq("slug", finalSlug)
      .single();

    if (existingCompany) {
      return {
        success: false,
        error: COMPANY_ERRORS.COMPANY_SLUG_EXISTS,
      };
    }

    // Convert empty strings to null for database compatibility
    const companyData = {
      ...validatedInput,
      slug: finalSlug,
      description: validatedInput.description || null,
      website: validatedInput.website || null,
      logo_url: validatedInput.logo_url || null,
      industry: validatedInput.industry || null,
      location: validatedInput.location || null,
      email: validatedInput.email || null,
      created_by: user.id,
    };

    // Create the company
    const { data: newCompany, error: createError } = await supabase
      .from("companies")
      .insert([companyData])
      .select()
      .single();

    if (createError || !newCompany) {
      console.error("Error creating company:", createError);
      return {
        success: false,
        error: COMPANY_ERRORS.COMPANY_CREATE_FAILED,
      };
    }

    // Add the user as primary member of the company
    const { error: memberError } = await supabase
      .from("company_members")
      .insert([{
        company_id: newCompany.id,
        user_id: user.id,
        role: "owner",
        is_primary: true,
      }]);

    if (memberError) {
      console.error("Error adding user as company member:", memberError);
      // Try to clean up the created company
      await supabase.from("companies").delete().eq("id", newCompany.id);
      
      return {
        success: false,
        error: COMPANY_ERRORS.COMPANY_CREATE_FAILED,
      };
    }

    return {
      success: true,
      data: newCompany as Company,
    };
  } catch (error) {
    console.error("Error in createCompany:", error);
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG,
    };
  }
} 