"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { getAllUsersSchema, type GetAllUsersInput } from "@/lib/validations/schemas/admin.schema";
import { ADMIN_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";

/**
 * Lấy danh sách tất cả người dùng (chỉ dành cho admin)
 * @param input - Tham số tìm kiếm và phân trang
 * @returns Promise<{ success: boolean; data?: AdminUserSearchResult; error?: string }>
 */
export async function getAllUsers(input: GetAllUsersInput) {
  try {
    // Validate input
    const validatedInput = getAllUsersSchema.parse(input);

    // Require admin authentication
    await requireAdmin();

    const supabase = await createClient();
    const { page = 1, limit = 20, role, search, is_active, sort_by = "created_at", sort_order = "desc" } = validatedInput;

    // Build query
    let query = supabase
      .from("users")
      .select("*");

    // Apply filters
    if (role) {
      query = query.eq("role", role);
    }

    if (typeof is_active === "boolean") {
      query = query.eq("is_active", is_active);
    }

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Count total records
    const { count, error: countError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("Error counting users:", countError);
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

    const { data: users, error } = await query;

    if (error) {
      console.error("Error fetching users:", error);
      return {
        success: false,
        error: ADMIN_ERRORS.DASHBOARD_LOAD_FAILED,
      };
    }

    const total = count || 0;
    const has_next = offset + limit < total;
    const has_previous = page > 1;

    return {
      success: true,
      data: {
        users: users || [],
        total,
        page,
        limit,
        has_next,
        has_previous,
      } as {
        users: typeof users;
        total: number;
        page: number;
        limit: number;
        has_next: boolean;
        has_previous: boolean;
      },
    };
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG,
    };
  }
} 