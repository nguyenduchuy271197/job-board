"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { getAllJobsSchema, type GetAllJobsInput } from "@/lib/validations/schemas/admin.schema";
import { ADMIN_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";

/**
 * Lấy danh sách tất cả công việc (chỉ dành cho admin)
 * @param input - Tham số tìm kiếm và phân trang
 * @returns Promise<{ success: boolean; data?: AdminJobSearchResult; error?: string }>
 */
export async function getAllJobs(input: GetAllJobsInput) {
  try {
    // Validate input
    const validatedInput = getAllJobsSchema.parse(input);

    // Require admin authentication
    await requireAdmin();

    const supabase = await createClient();
    const { 
      page = 1, 
      limit = 20, 
      search, 
      status, 
      company_id, 
      employment_type, 
      sort_by = "created_at", 
      sort_order = "desc" 
    } = validatedInput;

    // Build query with company and skills
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
      `);

    // Apply filters
    if (status) {
      query = query.eq("status", status);
    }

    if (company_id) {
      query = query.eq("company_id", company_id);
    }

    if (employment_type) {
      query = query.eq("employment_type", employment_type);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Count total records with same filters
    let countQuery = supabase
      .from("jobs")
      .select("*", { count: "exact", head: true });

    if (status) {
      countQuery = countQuery.eq("status", status);
    }

    if (company_id) {
      countQuery = countQuery.eq("company_id", company_id);
    }

    if (employment_type) {
      countQuery = countQuery.eq("employment_type", employment_type);
    }

    if (search) {
      countQuery = countQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error("Error counting jobs:", countError);
      return {
        success: false,
        error: ADMIN_ERRORS.DASHBOARD_LOAD_FAILED,
      };
    }

    // Apply sorting
    const ascending = sort_order === "asc";
    query = query.order(sort_by, { ascending });

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: jobs, error } = await query;

    if (error) {
      console.error("Error fetching jobs:", error);
      return {
        success: false,
        error: ADMIN_ERRORS.DASHBOARD_LOAD_FAILED,
      };
    }

    // Transform data to match expected type
    const transformedJobs = jobs?.map(job => ({
      ...job,
      companies: job.companies as {
        id: string;
        name: string;
        slug: string;
        logo_url: string | null;
        location: string | null;
        verified: boolean;
      },
      job_skills: job.job_skills?.map((js: {
        skills: {
          id: string;
          name: string;
          category: string;
        };
      }) => ({
        ...js,
        skills: js.skills,
      })) || [],
    })) || [];

    const total = count || 0;
    const has_next = offset + limit < total;
    const has_previous = page > 1;

    return {
      success: true,
      data: {
        jobs: transformedJobs,
        total,
        page,
        limit,
        has_next,
        has_previous,
      } as {
        jobs: typeof transformedJobs;
        total: number;
        page: number;
        limit: number;
        has_next: boolean;
        has_previous: boolean;
      },
    };
  } catch (error) {
    console.error("Error in getAllJobs:", error);
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG,
    };
  }
} 