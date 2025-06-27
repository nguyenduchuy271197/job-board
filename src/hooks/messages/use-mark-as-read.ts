import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { markAsRead } from "@/actions/messages";
import { type MarkMessageReadInput } from "@/lib/validations/schemas/message.schema";

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: MarkMessageReadInput) => {
      const result = await markAsRead(params);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.message;
    },
    onSuccess: () => {
      // Invalidate messages queries to update read status
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi đánh dấu tin nhắn đã đọc");
    },
  });
} 