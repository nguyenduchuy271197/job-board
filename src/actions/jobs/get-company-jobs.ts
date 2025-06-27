"use server";

import { createClient } from "@/lib/supabase/server";
import { getCompanyJobsSchema, type GetCompanyJobsInput } from "@/lib/validations/schemas/job.schema";
import { JOB_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";
import { getCurrentUserId } from "@/lib/auth";
import type { JobWithCompanyAndSkills } from "@/types/custom.types";

/**
 * Lấy danh sách công việc của một công ty
 * @param input - Company ID và tham số phân trang
 * @returns Promise<{ success: boolean; data?: JobWithCompanyAndSkills[]; error?: string; total?: number; page?: number; limit?: number }>
 */
export async function getCompanyJobs(input: GetCompanyJobsInput) {
  try {
    // Validate input
    const validatedInput = getCompanyJobsSchema.parse(input);

    const supabase = await createClient();
    const currentUserId = await getCurrentUserId();

    // Build query - if user is a member of the company, show all jobs; otherwise show only published jobs
    let query = supabase
      .from("jobs")
      .select(`
        *,
        companies (
          id,
          name,
          slug,
          logo_url,
          location,
          verified
        ),
        job_skills (
          skills (
            id,
            name,
            category
          )
        )
      `)
      .eq("company_id", validatedInput.company_id);

    // Check if current user is a member of this company
    let isCompanyMember = false;
    if (currentUserId) {
      const { data: membership } = await supabase
        .from("company_members")
        .select("id")
        .eq("company_id", validatedInput.company_id)
        .eq("user_id", currentUserId)
        .single();
      
      isCompanyMember = !!membership;
    }

    // Apply status filter
    if (validatedInput.status) {
      query = query.eq("status", validatedInput.status);
    } else if (!isCompanyMember) {
      // For non-members, only show published jobs
      query = query.eq("status", "published");
    }

    // Count total records
    let countQuery = supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("company_id", validatedInput.company_id);

    if (validatedInput.status) {
      countQuery = countQuery.eq("status", validatedInput.status);
    } else if (!isCompanyMember) {
      countQuery = countQuery.eq("status", "published");
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error("Error counting company jobs:", countError);
    }

    // Apply ordering
    query = query.order("created_at", { ascending: false });

    // Apply pagination
    const { page, limit } = validatedInput;
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: jobs, error } = await query;

    if (error) {
      console.error("Error fetching company jobs:", error);
      return {
        success: false,
        error: JOB_ERRORS.JOB_NOT_FOUND,
      };
    }

    // Transform data to match expected type
    const transformedJobs: JobWithCompanyAndSkills[] = jobs?.map(job => {
      const companies = job.companies as unknown as {
        id: string;
        name: string;
        slug: string;
        logo_url: string | null;
        location: string | null;
        verified: boolean;
      };
      
      const jobSkills = job.job_skills?.map((js: unknown) => {
        const jsTyped = js as {
          skills: {
            id: string;
            name: string;
            category: string | null;
          };
        };
        return {
          ...jsTyped,
          skills: jsTyped.skills,
        };
      }) || [];

      return {
        ...job,
        companies,
        job_skills: jobSkills,
      };
    }) || [];

    return {
      success: true,
      data: transformedJobs,
      total: count || 0,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error in getCompanyJobs:", error);
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG,
    };
  }
} 