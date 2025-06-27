"use server";

import { createClient } from "@/lib/supabase/server";
import { getJobsSchema, type GetJobsInput } from "@/lib/validations/schemas/job.schema";
import { JOB_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";
import type { JobWithCompanyAndSkills } from "@/types/custom.types";

/**
 * Lấy danh sách công việc đã được công bố với phân trang
 * @param input - Tham số truy vấn và phân trang
 * @returns Promise<{ success: boolean; data?: JobWithCompanyAndSkills[]; error?: string; total?: number; page?: number; limit?: number }>
 */
export async function getJobs(input: GetJobsInput) {
  try {
    // Validate input
    const validatedInput = getJobsSchema.parse(input);

    const supabase = await createClient();

    // Build query
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
      .eq("status", "published")
      .order("published_at", { ascending: false });

    // Apply filters
    if (validatedInput.company_id) {
      query = query.eq("company_id", validatedInput.company_id);
    }

    // Count total records
    let countQuery = supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("status", "published");

    // Apply same filters for count
    if (validatedInput.company_id) {
      countQuery = countQuery.eq("company_id", validatedInput.company_id);
    }

    const { count, error: countError } = await countQuery;

    if (countError && countError.message !== "No rows found") {
      console.error("Error counting jobs:", countError);
      return {
        success: false,
        error: JOB_ERRORS.JOB_NOT_FOUND,
      };
    }

    // Apply pagination
    const { page, limit } = validatedInput;
    const offset = (page - 1) * limit;
    
    query = query.range(offset, offset + limit - 1);

    const { data: jobs, error } = await query;

    if (error) {
      console.error("Error fetching jobs:", error);
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
    console.error("Error in getJobs:", error);
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG,
    };
  }
} 