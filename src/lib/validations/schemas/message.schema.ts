import { z } from "zod";
import { uuidSchema } from "../common";

// Get messages validation
export const getMessagesSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(50).optional().default(20),
  sort_by: z.enum(["created_at", "read_at"]).optional().default("created_at"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
  
  // Filter options
  conversation_with: uuidSchema.optional(), // Get conversation with specific user
  application_id: uuidSchema.optional(), // Filter by application
  unread_only: z.boolean().optional().default(false),
  status: z.enum(["sent", "delivered", "read"]).optional(),
});

export type GetMessagesInput = z.infer<typeof getMessagesSchema>;

// Send message validation
export const sendMessageSchema = z.object({
  recipient_id: uuidSchema,
  application_id: uuidSchema.optional(),
  subject: z.string().min(1).max(200).optional(),
  content: z.string().min(1, "Nội dung tin nhắn là bắt buộc").max(2000, "Tin nhắn không được quá 2000 ký tự"),
}).refine((data) => {
  // If no application_id, subject is required
  if (!data.application_id && !data.subject) {
    return false;
  }
  return true;
}, {
  message: "Tiêu đề là bắt buộc khi gửi tin nhắn trực tiếp",
  path: ["subject"]
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;

// Mark message as read validation
export const markMessageReadSchema = z.object({
  message_id: uuidSchema,
});

export type MarkMessageReadInput = z.infer<typeof markMessageReadSchema>; 