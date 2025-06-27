"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { getIndustriesSchema, type GetIndustriesInput } from "@/lib/validations/schemas/admin.schema";
import { ADMIN_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";

/**
 * Lấy danh sách ngành nghề (chỉ dành cho admin)
 * @param input - Tham số tìm kiếm và sắp xếp
 * @returns Promise<{ success: boolean; data?: Industry[]; error?: string }>
 */
export async function getIndustries(input: Partial<GetIndustriesInput> = {}) {
  try {
    // Validate input
    const validatedInput = getIndustriesSchema.parse(input);

    // Require admin authentication
    await requireAdmin();

    const supabase = await createClient();
    const { search, sort_by = "name", sort_order = "asc" } = validatedInput;

    // Build query
    let query = supabase
      .from("industries")
      .select("*");

    // Apply search filter
    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    // Apply sorting
    const ascending = sort_order === "asc";
    query = query.order(sort_by, { ascending });

    const { data: industries, error } = await query;

    if (error) {
      console.error("Error fetching industries:", error);
      return {
        success: false,
        error: ADMIN_ERRORS.DASHBOARD_LOAD_FAILED,
      };
    }

    return {
      success: true,
      data: industries || [],
    };
  } catch (error) {
    console.error("Error in getIndustries:", error);
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG,
    };
  }
} 