import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { sendMessage } from "@/actions/messages";
import { type SendMessageInput } from "@/lib/validations/schemas/message.schema";

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SendMessageInput) => {
      const result = await sendMessage(params);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    },
    onSuccess: () => {
      // Invalidate messages queries to show the new message
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      
      toast.success("Đã gửi tin nhắn thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi gửi tin nhắn");
    },
  });
} 