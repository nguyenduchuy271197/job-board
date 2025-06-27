"use server";

import { createClient } from "@/lib/supabase/server";
import { getCompanySchema, type GetCompanyInput } from "@/lib/validations/schemas/company.schema";
import { COMPANY_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";
import { getCurrentUserId } from "@/lib/auth";
import type { CompanyDetails } from "@/types/custom.types";

/**
 * Lấy chi tiết công ty theo ID hoặc slug
 * @param input - Company ID hoặc slug
 * @returns Promise<{ success: boolean; data?: CompanyDetails; error?: string }>
 */
export async function getCompanyDetails(input: GetCompanyInput) {
  try {
    // Validate input
    const validatedInput = getCompanySchema.parse(input);

    const supabase = await createClient();
    const currentUserId = await getCurrentUserId();

    // Build the query
    let query = supabase
      .from("companies")
      .select(`
        *,
        company_members (
          id,
          role,
          is_primary,
          users (
            id,
            full_name,
            email,
            avatar_url,
            role
          )
        ),
        jobs (
          id,
          title,
          slug,
          status,
          employment_type,
          experience_level,
          location,
          is_remote,
          published_at,
          application_count,
          created_at
        )
      `);

    // Apply filter based on input
    if (validatedInput.id) {
      query = query.eq("id", validatedInput.id);
    } else if (validatedInput.slug) {
      query = query.eq("slug", validatedInput.slug);
    }

    const { data: company, error } = await query.single();

    if (error || !company) {
      console.error("Error fetching company details:", error);
      return {
        success: false,
        error: COMPANY_ERRORS.COMPANY_NOT_FOUND,
      };
    }

    // Transform data to match expected type
    const companyMembers = company.company_members?.map((member: unknown) => {
      const memberTyped = member as {
        id: string;
        role: string;
        is_primary: boolean;
        users: {
          id: string;
          full_name: string | null;
          email: string;
          avatar_url: string | null;
          role: string;
        };
      };
      return {
        ...memberTyped,
        users: memberTyped.users,
      };
    }) || [];

    const jobs = company.jobs?.map((job: unknown) => {
      const jobTyped = job as {
        id: string;
        title: string;
        slug: string;
        status: string;
        employment_type: string;
        experience_level: string;
        location: string | null;
        is_remote: boolean;
        published_at: string | null;
        application_count: number;
        created_at: string;
      };
      return jobTyped;
    }) || [];

    // Count statistics
    const jobsCount = jobs.length;
    const activeJobsCount = jobs.filter((job: { status: string }) => job.status === "published").length;

    // Check if current user is a member of this company
    const isCompanyMember = currentUserId 
      ? companyMembers.some((member: { users: { id: string } }) => member.users.id === currentUserId)
      : false;

    // Filter sensitive data for non-members
    const filteredJobs = isCompanyMember 
      ? jobs 
      : jobs.filter((job: { status: string }) => job.status === "published");

    const filteredMembers = isCompanyMember 
      ? companyMembers 
      : companyMembers.filter((member: { is_primary: boolean }) => member.is_primary);

    const companyDetails: CompanyDetails = {
      ...company,
      company_members: filteredMembers,
      jobs: filteredJobs,
      jobs_count: jobsCount,
      active_jobs_count: activeJobsCount,
    };

    return {
      success: true,
      data: companyDetails,
    };
  } catch (error) {
    console.error("Error in getCompanyDetails:", error);
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG,
    };
  }
} 