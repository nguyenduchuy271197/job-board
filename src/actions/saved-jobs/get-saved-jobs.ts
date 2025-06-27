"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth";
import { getSavedJobsSchema, type GetSavedJobsInput } from "@/lib/validations/schemas/saved-job.schema";
import { type SavedJobsResult, type SavedJobWithDetails } from "@/types/custom.types";
import { SAVED_JOB_ERRORS } from "@/constants/error-messages";

type Result = 
  | { success: true; data: SavedJobsResult }
  | { success: false; error: string };

export async function getSavedJobs(params: Partial<GetSavedJobsInput> = {}): Promise<Result> {
  try {
    // 1. Validate input
    const validatedParams = getSavedJobsSchema.parse(params);
    const { 
      page, 
      limit, 
      sort_by, 
      sort_order, 
      search,
      location,
      employment_type,
      experience_level,
      salary_min,
      salary_max
    } = validatedParams;

    // 2. Check authentication
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "Vui lòng đăng nhập để xem việc làm đã lưu" };
    }

    // 3. Get database client
    const supabase = await createClient();

    // 4. Build base query with joins
    let query = supabase
      .from("saved_jobs")
      .select(`
        id,
        job_id,
        user_id,
        created_at,
        jobs (
          id,
          title,
          slug,
          description,
          salary_min,
          salary_max,
          currency,
          employment_type,
          experience_level,
          location,
          is_remote,
          status,
          published_at,
          application_count,
          companies (
            id,
            name,
            slug,
            logo_url,
            location,
            verified
          )
        )
      `)
      .eq("user_id", userId);

    // 5. Apply filters
    if (search) {
      query = query.or(`jobs.title.ilike.%${search}%,jobs.description.ilike.%${search}%,jobs.companies.name.ilike.%${search}%`);
    }

    if (location) {
      query = query.or(`jobs.location.ilike.%${location}%,jobs.companies.location.ilike.%${location}%`);
    }

    if (employment_type) {
      query = query.eq("jobs.employment_type", employment_type);
    }

    if (experience_level) {
      query = query.eq("jobs.experience_level", experience_level);
    }

    if (salary_min) {
      query = query.gte("jobs.salary_min", salary_min);
    }

    if (salary_max) {
      query = query.lte("jobs.salary_max", salary_max);
    }

    // Only show published jobs
    query = query.eq("jobs.status", "published");

    // 6. Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from("saved_jobs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) {
      console.error("Error getting saved jobs count:", countError);
      return { success: false, error: SAVED_JOB_ERRORS.SEARCH_FAILED || "Không thể lấy số lượng việc làm đã lưu" };
    }

    // 7. Apply pagination and sorting
    const offset = (page - 1) * limit;
    
    // Map sort_by to actual column names
    let orderColumn = "created_at";
    if (sort_by === "job_title") {
      orderColumn = "jobs.title";
    } else if (sort_by === "company_name") {
      orderColumn = "jobs.companies.name";
    }

    const { data: savedJobs, error } = await query
      .order(orderColumn, { ascending: sort_order === "asc" })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching saved jobs:", error);
      return { success: false, error: SAVED_JOB_ERRORS.SEARCH_FAILED || "Không thể lấy danh sách việc làm đã lưu" };
    }

    // 8. Calculate pagination metadata
    const total = totalCount || 0;
    const hasNext = offset + limit < total;
    const hasPrevious = page > 1;

    const result: SavedJobsResult = {
      saved_jobs: (savedJobs || []) as unknown as SavedJobWithDetails[],
      total,
      page,
      limit,
      has_next: hasNext,
      has_previous: hasPrevious,
    };

    return { success: true, data: result };

  } catch (error) {
    console.error("Error in getSavedJobs:", error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: "Đã có lỗi xảy ra khi lấy danh sách việc làm đã lưu" };
  }
} 