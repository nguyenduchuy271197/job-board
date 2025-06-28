"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { GENERIC_ERRORS } from "@/constants/error-messages";
import type { Industry } from "@/types/custom.types";

const getIndustriesSchema = z.object({
  search: z.string().max(100).optional(),
  sort_by: z.enum(["name", "created_at"]).optional().default("name"),
  sort_order: z.enum(["asc", "desc"]).optional().default("asc"),
});

export type GetIndustriesInput = z.infer<typeof getIndustriesSchema>;

type Result = 
  | { success: true; data: Industry[] }
  | { success: false; error: string };

/**
 * Lấy danh sách ngành nghề (public - không yêu cầu admin)
 * @param input - Tham số tìm kiếm và sắp xếp
 * @returns Promise<Result>
 */
export async function getIndustries(input: Partial<GetIndustriesInput> = {}): Promise<Result> {
  try {
    // Validate input
    const validatedInput = getIndustriesSchema.parse(input);

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
        error: "Không thể tải danh sách ngành nghề",
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