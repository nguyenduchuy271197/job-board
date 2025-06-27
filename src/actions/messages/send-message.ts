"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth";
import { sendMessageSchema, type SendMessageInput } from "@/lib/validations/schemas/message.schema";
import { type Message } from "@/types/custom.types";
import { MESSAGE_ERRORS } from "@/constants/error-messages";

type Result = 
  | { success: true; data: Message }
  | { success: false; error: string };

export async function sendMessage(params: SendMessageInput): Promise<Result> {
  try {
    // 1. Validate input
    const { recipient_id, application_id, subject, content } = sendMessageSchema.parse(params);

    // 2. Check authentication
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "Vui lòng đăng nhập để gửi tin nhắn" };
    }

    // 3. Prevent self-messaging
    if (userId === recipient_id) {
      return { success: false, error: MESSAGE_ERRORS.CANNOT_MESSAGE_SELF };
    }

    // 4. Get database client
    const supabase = await createClient();

    // 5. Verify recipient exists and is active
    const { data: recipient, error: recipientError } = await supabase
      .from("users")
      .select("id, role, is_active")
      .eq("id", recipient_id)
      .single();

    if (recipientError || !recipient) {
      return { success: false, error: MESSAGE_ERRORS.INVALID_RECIPIENT };
    }

    if (!recipient.is_active) {
      return { success: false, error: "Người nhận không còn hoạt động" };
    }

    // 6. If application_id is provided, verify access to application
    if (application_id) {
      const { data: application, error: appError } = await supabase
        .from("applications")
        .select(`
          id,
          candidate_id,
          jobs (
            id,
            company_id,
            companies (
              id,
              company_members (
                user_id
              )
            )
          )
        `)
        .eq("id", application_id)
        .single();

      if (appError || !application) {
        return { success: false, error: "Không tìm thấy đơn ứng tuyển" };
      }

      // Check if user has permission to message about this application
      const isCandidate = application.candidate_id === userId;
      const jobData = application.jobs as unknown as {
        id: string;
        company_id: string;
        companies: {
          id: string;
          company_members: { user_id: string }[];
        };
      };
      const isEmployer = jobData?.companies?.company_members?.some(
        (member: { user_id: string }) => member.user_id === userId
      );

      if (!isCandidate && !isEmployer) {
        return { success: false, error: MESSAGE_ERRORS.MESSAGE_ACCESS_DENIED };
      }

      // Verify the recipient is involved in this application
      const recipientIsCandidate = application.candidate_id === recipient_id;
      const recipientIsEmployer = jobData?.companies?.company_members?.some(
        (member: { user_id: string }) => member.user_id === recipient_id
      );

      if (!recipientIsCandidate && !recipientIsEmployer) {
        return { success: false, error: "Người nhận không liên quan đến đơn ứng tuyển này" };
      }
    }

    // 7. Send the message
    const { data: message, error: sendError } = await supabase
      .from("messages")
      .insert({
        sender_id: userId,
        recipient_id,
        application_id: application_id || null,
        subject: subject || null,
        content,
        status: "sent",
      })
      .select()
      .single();

    if (sendError) {
      console.error("Error sending message:", sendError);
      return { success: false, error: MESSAGE_ERRORS.MESSAGE_SEND_FAILED };
    }

    return { success: true, data: message };

  } catch (error) {
    console.error("Error in sendMessage:", error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: "Đã có lỗi xảy ra khi gửi tin nhắn" };
  }
} 