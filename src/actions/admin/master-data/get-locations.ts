"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { getLocationsSchema, type GetLocationsInput } from "@/lib/validations/schemas/admin.schema";
import { ADMIN_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";

/**
 * Lấy danh sách địa điểm (chỉ dành cho admin)
 * @param input - Tham số tìm kiếm và sắp xếp
 * @returns Promise<{ success: boolean; data?: Location[]; error?: string }>
 */
export async function getLocations(input: Partial<GetLocationsInput> = {}) {
  try {
    // Validate input
    const validatedInput = getLocationsSchema.parse(input);

    // Require admin authentication
    await requireAdmin();

    const supabase = await createClient();
    const { search, country, province, sort_by = "name", sort_order = "asc" } = validatedInput;

    // Build query
    let query = supabase
      .from("locations")
      .select("*");

    // Apply filters
    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (country) {
      query = query.eq("country", country);
    }

    if (province) {
      query = query.eq("province", province);
    }

    // Apply sorting
    const ascending = sort_order === "asc";
    query = query.order(sort_by, { ascending });

    const { data: locations, error } = await query;

    if (error) {
      console.error("Error fetching locations:", error);
      return {
        success: false,
        error: ADMIN_ERRORS.DASHBOARD_LOAD_FAILED,
      };
    }

    return {
      success: true,
      data: locations || [],
    };
  } catch (error) {
    console.error("Error in getLocations:", error);
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG,
    };
  }
} 