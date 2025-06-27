"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth";
import { markMessageReadSchema, type MarkMessageReadInput } from "@/lib/validations/schemas/message.schema";
import { MESSAGE_ERRORS } from "@/constants/error-messages";

type Result = 
  | { success: true; message: string }
  | { success: false; error: string };

export async function markAsRead(params: MarkMessageReadInput): Promise<Result> {
  try {
    // 1. Validate input
    const { message_id } = markMessageReadSchema.parse(params);

    // 2. Check authentication
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "Vui lòng đăng nhập để đánh dấu tin nhắn đã đọc" };
    }

    // 3. Get database client
    const supabase = await createClient();

    // 4. Verify message exists and user is recipient
    const { data: message, error: messageError } = await supabase
      .from("messages")
      .select("id, recipient_id, read_at")
      .eq("id", message_id)
      .single();

    if (messageError || !message) {
      return { success: false, error: MESSAGE_ERRORS.MESSAGE_NOT_FOUND };
    }

    if (message.recipient_id !== userId) {
      return { success: false, error: MESSAGE_ERRORS.MESSAGE_ACCESS_DENIED };
    }

    // 5. Check if already read
    if (message.read_at) {
      return { success: true, message: "Tin nhắn đã được đánh dấu đã đọc trước đó" };
    }

    // 6. Mark as read
    const { error: updateError } = await supabase
      .from("messages")
      .update({
        read_at: new Date().toISOString(),
        status: "read"
      })
      .eq("id", message_id)
      .eq("recipient_id", userId);

    if (updateError) {
      console.error("Error marking message as read:", updateError);
      return { success: false, error: "Không thể đánh dấu tin nhắn đã đọc" };
    }

    return { success: true, message: "Đã đánh dấu tin nhắn đã đọc" };

  } catch (error) {
    console.error("Error in markAsRead:", error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: "Đã có lỗi xảy ra khi đánh dấu tin nhắn đã đọc" };
  }
} 