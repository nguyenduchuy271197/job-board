"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth";
import { getMessagesSchema, type GetMessagesInput } from "@/lib/validations/schemas/message.schema";
import { type MessageWithUsers } from "@/types/custom.types";
import { MESSAGE_ERRORS } from "@/constants/error-messages";

type MessageResult = {
  messages: MessageWithUsers[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_previous: boolean;
};

type Result = 
  | { success: true; data: MessageResult }
  | { success: false; error: string };

export async function getMessages(params: Partial<GetMessagesInput> = {}): Promise<Result> {
  try {
    // 1. Validate input
    const validatedParams = getMessagesSchema.parse(params);
    const { 
      page,
      limit,
      sort_by,
      sort_order,
      conversation_with,
      application_id,
      unread_only,
      status
    } = validatedParams;

    // 2. Check authentication
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "Vui lòng đăng nhập để xem tin nhắn" };
    }

    // 3. Get database client
    const supabase = await createClient();

    // 4. Build base query with joins
    let query = supabase
      .from("messages")
      .select(`
        id,
        sender_id,
        recipient_id,
        application_id,
        subject,
        content,
        status,
        read_at,
        created_at,
        sender:users!messages_sender_id_fkey (
          id,
          full_name,
          avatar_url,
          role
        ),
        recipient:users!messages_recipient_id_fkey (
          id,
          full_name,
          avatar_url,
          role
        )
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);

    // 5. Apply filters
    if (conversation_with) {
      query = query.or(`
        and(sender_id.eq.${userId},recipient_id.eq.${conversation_with}),
        and(sender_id.eq.${conversation_with},recipient_id.eq.${userId})
      `);
    }

    if (application_id) {
      query = query.eq("application_id", application_id);
    }

    if (unread_only) {
      query = query.is("read_at", null).eq("recipient_id", userId);
    }

    if (status) {
      query = query.eq("status", status);
    }

    // 6. Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);

    if (countError) {
      console.error("Error getting messages count:", countError);
      return { success: false, error: MESSAGE_ERRORS.MESSAGE_NOT_FOUND || "Không thể lấy số lượng tin nhắn" };
    }

    // 7. Apply pagination and sorting
    const offset = (Number(page) - 1) * Number(limit);

    let orderColumn = "created_at";
    if (sort_by === "read_at") {
      orderColumn = "read_at";
    }

    const { data: messages, error } = await query
      .order(orderColumn, { ascending: sort_order === "asc" })
      .range(offset, offset + Number(limit) - 1);

    if (error) {
      console.error("Error fetching messages:", error);
      return { success: false, error: MESSAGE_ERRORS.MESSAGE_NOT_FOUND || "Không thể lấy danh sách tin nhắn" };
    }

    // 8. Calculate pagination metadata
    const total = totalCount || 0;
    const hasNext = offset + Number(limit) < total;
    const hasPrevious = Number(page) > 1;

    const result: MessageResult = {
      messages: (messages || []) as unknown as MessageWithUsers[],
      total,
      page: Number(page),
      limit: Number(limit),
      has_next: hasNext,
      has_previous: hasPrevious,
    };

    return { success: true, data: result };

  } catch (error) {
    console.error("Error in getMessages:", error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: "Đã có lỗi xảy ra khi lấy danh sách tin nhắn" };
  }
} 