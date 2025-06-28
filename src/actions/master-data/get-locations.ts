"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { GENERIC_ERRORS } from "@/constants/error-messages";
import type { Location } from "@/types/custom.types";

const getLocationsSchema = z.object({
  search: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  province: z.string().max(100).optional(),
  sort_by: z.enum(["name", "created_at"]).optional().default("name"),
  sort_order: z.enum(["asc", "desc"]).optional().default("asc"),
});

export type GetLocationsInput = z.infer<typeof getLocationsSchema>;

type Result = 
  | { success: true; data: Location[] }
  | { success: false; error: string };

/**
 * Lấy danh sách địa điểm (public - không yêu cầu admin)
 * @param input - Tham số tìm kiếm và sắp xếp
 * @returns Promise<Result>
 */
export async function getLocations(input: Partial<GetLocationsInput> = {}): Promise<Result> {
  try {
    // Validate input
    const validatedInput = getLocationsSchema.parse(input);

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
        error: "Không thể tải danh sách địa điểm",
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