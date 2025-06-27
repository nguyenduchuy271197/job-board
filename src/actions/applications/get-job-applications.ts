"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuth, isCompanyMember } from "@/lib/auth";
import { getJobApplicationsSchema, type GetJobApplicationsInput } from "@/lib/validations/schemas/application.schema";
import { APPLICATION_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";
import type { ApplicationWithJobAndCandidate, ApplicationSearchResult } from "@/types/custom.types";

type Result = 
  | { success: true; data: ApplicationSearchResult }
  | { success: false; error: string };

export async function getJobApplications(input: GetJobApplicationsInput): Promise<Result> {
  try {
    // 1. Validate input
    const validatedData = getJobApplicationsSchema.parse(input);
    
    // 2. Authenticate user and ensure they are an employer
    const user = await requireAuth();
    
    if (user.role !== "employer") {
      return { 
        success: false, 
        error: "Chỉ nhà tuyển dụng mới có thể xem đơn ứng tuyển" 
      };
    }

    const supabase = await createClient();

    // 3. Check if job exists and get company_id
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("id, company_id, title")
      .eq("id", validatedData.job_id)
      .single();

    if (jobError || !job) {
      return { 
        success: false, 
        error: "Không tìm thấy việc làm" 
      };
    }

    // 4. Verify user is a member of the company that owns this job
    const isMember = await isCompanyMember(job.company_id);
    if (!isMember) {
      return { 
        success: false, 
        error: APPLICATION_ERRORS.CANNOT_VIEW_APPLICATION 
      };
    }

    const page = Number(validatedData.page ?? 1);
    const limit = Number(validatedData.limit ?? 10);
    const status = validatedData.status;
    const sort_by = validatedData.sort_by ?? "applied_at";
    const sort_order = validatedData.sort_order ?? "desc";

    const offset = (page - 1) * limit;

    // 5. Build query for applications with candidate details
    let query = supabase
      .from("applications")
      .select(`
        *,
        jobs!inner(
          id,
          title,
          slug,
          employment_type,
          experience_level,
          location,
          is_remote,
          status,
          published_at,
          companies!inner(
            id,
            name,
            slug,
            logo_url,
            location
          )
        ),
        users!inner(
          id,
          full_name,
          email,
          phone,
          avatar_url,
          location,
          bio,
          linkedin_url,
          portfolio_url
        )
      `)
      .eq("job_id", validatedData.job_id);

    // 6. Apply filters
    if (status) {
      query = query.eq("status", status);
    }

    // 7. Apply sorting
    query = query.order(sort_by as "applied_at", { ascending: sort_order === "asc" });

    // 8. Get total count for pagination
    let countQuery = supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("job_id", validatedData.job_id);

    if (status) {
      countQuery = countQuery.eq("status", status);
    }

    const { count: totalCount, error: countError } = await countQuery;

    if (countError) {
      console.error("Count job applications error:", countError);
      return { 
        success: false, 
        error: GENERIC_ERRORS.SOMETHING_WENT_WRONG 
      };
    }

    // 9. Get paginated applications
    const { data: applications, error: applicationsError } = await query
      .range(offset, offset + limit - 1);

    if (applicationsError) {
      console.error("Get job applications error:", applicationsError);
      return { 
        success: false, 
        error: GENERIC_ERRORS.SOMETHING_WENT_WRONG 
      };
    }

    const total = totalCount || 0;
    const has_next = page * limit < total;
    const has_previous = page > 1;

    return { 
      success: true, 
      data: {
        applications: applications as ApplicationWithJobAndCandidate[],
        total,
        page,
        limit,
        has_next,
        has_previous,
      }
    };
    
  } catch (error) {
    console.error("Get job applications error:", error);
    return { 
      success: false, 
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG 
    };
  }
} 