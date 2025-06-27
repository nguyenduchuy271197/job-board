"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { getAllCompaniesSchema, type GetAllCompaniesInput } from "@/lib/validations/schemas/admin.schema";
import { ADMIN_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";

/**
 * Lấy danh sách tất cả công ty (chỉ dành cho admin)
 * @param input - Tham số tìm kiếm và phân trang
 * @returns Promise<{ success: boolean; data?: AdminCompanySearchResult; error?: string }>
 */
export async function getAllCompanies(input: GetAllCompaniesInput) {
  try {
    // Validate input
    const validatedInput = getAllCompaniesSchema.parse(input);

    // Require admin authentication
    await requireAdmin();

    const supabase = await createClient();
    const { page = 1, limit = 20, search, verified, industry, sort_by = "created_at", sort_order = "desc" } = validatedInput;

    // Build query with job counts
    let query = supabase
      .from("companies")
      .select(`
        *,
        jobs:jobs(count),
        company_members:company_members(
          users (
            id,
            full_name,
            email
          )
        )
      `);

    // Apply filters
    if (typeof verified === "boolean") {
      query = query.eq("verified", verified);
    }

    if (industry) {
      query = query.eq("industry", industry);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Count total records with same filters
    let countQuery = supabase
      .from("companies")
      .select("*", { count: "exact", head: true });

    if (typeof verified === "boolean") {
      countQuery = countQuery.eq("verified", verified);
    }

    if (industry) {
      countQuery = countQuery.eq("industry", industry);
    }

    if (search) {
      countQuery = countQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error("Error counting companies:", countError);
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

    const { data: companies, error } = await query;

    if (error) {
      console.error("Error fetching companies:", error);
      return {
        success: false,
        error: ADMIN_ERRORS.DASHBOARD_LOAD_FAILED,
      };
    }

    // Transform data to include job counts
    const transformedCompanies = companies?.map(company => ({
      ...company,
      jobs_count: company.jobs?.[0]?.count || 0,
      active_jobs_count: 0, // This would need a more complex query
    })) || [];

    const total = count || 0;
    const has_next = offset + limit < total;
    const has_previous = page > 1;

    return {
      success: true,
      data: {
        companies: transformedCompanies,
        total,
        page,
        limit,
        has_next,
        has_previous,
      } as {
        companies: typeof transformedCompanies;
        total: number;
        page: number;
        limit: number;
        has_next: boolean;
        has_previous: boolean;
      },
    };
  } catch (error) {
    console.error("Error in getAllCompanies:", error);
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG,
    };
  }
} 