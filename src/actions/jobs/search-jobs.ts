"use server";

import { createClient } from "@/lib/supabase/server";
import { searchJobsSchema, type SearchJobsInput } from "@/lib/validations/schemas/job.schema";
import { JOB_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";
import type { JobSearchResult } from "@/types/custom.types";

/**
 * Tìm kiếm công việc với bộ lọc nâng cao
 * @param input - Tham số tìm kiếm và bộ lọc
 * @returns Promise<{ success: boolean; data?: JobSearchResult; error?: string }>
 */
export async function searchJobs(input: SearchJobsInput) {
  try {
    // Validate input
    const validatedInput = searchJobsSchema.parse(input);

    const supabase = await createClient();

    // Build base query
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
      .eq("status", "published");

    // Apply text search filter
    if (validatedInput.query) {
      query = query.or(`title.ilike.%${validatedInput.query}%,description.ilike.%${validatedInput.query}%,requirements.ilike.%${validatedInput.query}%`);
    }

    // Apply location filter
    if (validatedInput.location) {
      query = query.ilike("location", `%${validatedInput.location}%`);
    }

    // Apply employment type filter
    if (validatedInput.employment_type) {
      query = query.eq("employment_type", validatedInput.employment_type);
    }

    // Apply experience level filter
    if (validatedInput.experience_level) {
      query = query.eq("experience_level", validatedInput.experience_level);
    }

    // Apply salary range filters
    if (validatedInput.salary_min) {
      query = query.gte("salary_min", validatedInput.salary_min);
    }
    if (validatedInput.salary_max) {
      query = query.lte("salary_max", validatedInput.salary_max);
    }

    // Apply company filter
    if (validatedInput.company_id) {
      query = query.eq("company_id", validatedInput.company_id);
    }

    // Apply remote work filter
    if (validatedInput.is_remote !== undefined) {
      query = query.eq("is_remote", validatedInput.is_remote);
    }

    // Count total results
    let countQuery = supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("status", "published");

    // Apply same filters to count query
    if (validatedInput.query) {
      countQuery = countQuery.or(`title.ilike.%${validatedInput.query}%,description.ilike.%${validatedInput.query}%,requirements.ilike.%${validatedInput.query}%`);
    }
    if (validatedInput.location) {
      countQuery = countQuery.ilike("location", `%${validatedInput.location}%`);
    }
    if (validatedInput.employment_type) {
      countQuery = countQuery.eq("employment_type", validatedInput.employment_type);
    }
    if (validatedInput.experience_level) {
      countQuery = countQuery.eq("experience_level", validatedInput.experience_level);
    }
    if (validatedInput.salary_min) {
      countQuery = countQuery.gte("salary_min", validatedInput.salary_min);
    }
    if (validatedInput.salary_max) {
      countQuery = countQuery.lte("salary_max", validatedInput.salary_max);
    }
    if (validatedInput.company_id) {
      countQuery = countQuery.eq("company_id", validatedInput.company_id);
    }
    if (validatedInput.is_remote !== undefined) {
      countQuery = countQuery.eq("is_remote", validatedInput.is_remote);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error("Error counting search results:", countError);
    }

    // Apply sorting
    const { sort_by, sort_order } = validatedInput;
    query = query.order(sort_by, { ascending: sort_order === "asc" });

    // Apply pagination
    const { page, limit } = validatedInput;
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: jobs, error } = await query;

    if (error) {
      console.error("Error searching jobs:", error);
      return {
        success: false,
        error: JOB_ERRORS.JOB_NOT_FOUND,
      };
    }

    // Transform data to match expected type
    const transformedJobs = jobs?.map(job => {
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

    // Filter by skills if specified (requires additional filtering since we can't join in the main query)
    let filteredJobs = transformedJobs;
    if (validatedInput.skills && validatedInput.skills.length > 0) {
      filteredJobs = transformedJobs.filter(job => 
        job.job_skills.some((jobSkill: { skills: { id: string; name: string; category: string | null } }) => 
          validatedInput.skills!.includes(jobSkill.skills.id)
        )
      );
    }

    const total = count || 0;
    const hasNext = (page * limit) < total;
    const hasPrevious = page > 1;

    const result: JobSearchResult = {
      jobs: filteredJobs,
      total,
      page,
      limit,
      has_next: hasNext,
      has_previous: hasPrevious,
    };

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error in searchJobs:", error);
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG,
    };
  }
} 