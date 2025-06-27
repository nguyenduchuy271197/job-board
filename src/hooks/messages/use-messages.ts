import { useQuery } from "@tanstack/react-query";
import { getMessages } from "@/actions/messages";
import { type GetMessagesInput } from "@/lib/validations/schemas/message.schema";

export function useMessages(params: Partial<GetMessagesInput> = {}) {
  return useQuery({
    queryKey: ["messages", params],
    queryFn: async () => {
      const result = await getMessages(params);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute - shorter for messages
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time feel
  });
} 