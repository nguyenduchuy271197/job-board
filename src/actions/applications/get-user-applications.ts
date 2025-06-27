"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { getUserApplicationsSchema, type GetUserApplicationsInput } from "@/lib/validations/schemas/application.schema";
import { GENERIC_ERRORS } from "@/constants/error-messages";
import type { ApplicationWithJobAndCandidate, ApplicationSearchResult } from "@/types/custom.types";

type Result = 
  | { success: true; data: ApplicationSearchResult }
  | { success: false; error: string };

export async function getUserApplications(input: GetUserApplicationsInput = {}): Promise<Result> {
  try {
    // 1. Validate input
    const validatedData = getUserApplicationsSchema.parse(input);
    
    // 2. Authenticate user and ensure they are a candidate
    const user = await requireAuth();
    
    if (user.role !== "candidate") {
      return { 
        success: false, 
        error: "Chỉ ứng viên mới có thể xem đơn ứng tuyển của mình" 
      };
    }

    const supabase = await createClient();

    const page = Number(validatedData.page ?? 1);
    const limit = Number(validatedData.limit ?? 10);
    const status = validatedData.status;
    const sort_by = validatedData.sort_by ?? "applied_at";
    const sort_order = validatedData.sort_order ?? "desc";

    const offset = (page - 1) * limit;

    // 3. Build query for applications with job and company details
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
        )
      `)
      .eq("candidate_id", user.id);

    // 4. Apply filters
    if (status) {
      query = query.eq("status", status);
    }

    // 5. Apply sorting
    query = query.order(sort_by as "applied_at", { ascending: sort_order === "asc" });

    // 6. Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("candidate_id", user.id)
      .then((result) => {
        if (status && result.data) {
          return supabase
            .from("applications")
            .select("id", { count: "exact", head: true })
            .eq("candidate_id", user.id)
            .eq("status", status);
        }
        return result;
      });

    if (countError) {
      console.error("Count applications error:", countError);
      return { 
        success: false, 
        error: GENERIC_ERRORS.SOMETHING_WENT_WRONG 
      };
    }

    // 7. Get paginated applications
    const { data: applications, error: applicationsError } = await query
      .range(offset, offset + limit - 1);

    if (applicationsError) {
      console.error("Get user applications error:", applicationsError);
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
    console.error("Get user applications error:", error);
    return { 
      success: false, 
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG 
    };
  }
} 