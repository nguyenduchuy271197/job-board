"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MessageCircle, Send, Search, Plus, User } from "lucide-react";
import { useMessages, useSendMessage, useMarkAsRead } from "@/hooks/messages";
import { Loading } from "@/components/shared/loading";
import { getRelativeTime, getMessageStatusLabel } from "@/constants/labels";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendMessageSchema } from "@/lib/validations/schemas/message.schema";
import type { SendMessageInput } from "@/lib/validations/schemas/message.schema";
import { toast } from "sonner";

export function MessagesManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);

  const { data: messagesData, isLoading } = useMessages({
    page: 1,
    limit: 50,
    sort_by: "created_at",
    sort_order: "desc",
  });

  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();

  const form = useForm<SendMessageInput>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      content: "",
      subject: "",
    },
  });

  const handleSendMessage = async (data: SendMessageInput) => {
    try {
      await sendMessageMutation.mutateAsync(data);
      toast.success("Gửi tin nhắn thành công");
      form.reset();
      setShowNewMessage(false);
    } catch {
      toast.error("Gửi tin nhắn thất bại");
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await markAsReadMutation.mutateAsync({ message_id: messageId });
    } catch (error) {
      console.error("Failed to mark message as read:", error);
    }
  };

  const messages = messagesData?.messages || [];

  // Group messages by conversation (by recipient/sender)
  const conversations = messages.reduce((acc, message) => {
    const otherUserId =
      message.sender_id === message.recipient_id
        ? message.recipient_id
        : message.sender_id;

    if (!acc[otherUserId]) {
      acc[otherUserId] = [];
    }
    acc[otherUserId].push(message);
    return acc;
  }, {} as Record<string, typeof messages>);

  const filteredConversations = Object.entries(conversations).filter(
    ([, msgs]) =>
      !searchQuery ||
      msgs.some(
        (msg) =>
          msg.sender?.full_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          msg.recipient?.full_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Conversations List */}
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Hộp thư ({Object.keys(conversations).length})
              </CardTitle>
              <Dialog open={showNewMessage} onOpenChange={setShowNewMessage}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Tin nhắn mới
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Gửi tin nhắn mới</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleSendMessage)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="recipient_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Người nhận</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="ID người nhận..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tiêu đề</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập tiêu đề tin nhắn..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nội dung</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Nhập nội dung tin nhắn..."
                                rows={4}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          disabled={sendMessageMutation.isPending}
                          className="flex items-center gap-2"
                        >
                          <Send className="h-4 w-4" />
                          {sendMessageMutation.isPending
                            ? "Đang gửi..."
                            : "Gửi tin nhắn"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowNewMessage(false)}
                        >
                          Hủy
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm cuộc trò chuyện..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Conversations */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="mx-auto h-8 w-8 mb-2" />
                  <p>Chưa có cuộc trò chuyện nào</p>
                </div>
              ) : (
                filteredConversations.map(([userId, msgs]) => {
                  const latestMessage = msgs[0];
                  const unreadCount = msgs.filter(
                    (msg) => msg.status !== "read"
                  ).length;

                  return (
                    <div
                      key={userId}
                      onClick={() => setSelectedConversation(userId)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedConversation === userId
                          ? "bg-muted border-primary"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {latestMessage.sender?.full_name ||
                                  latestMessage.recipient?.full_name ||
                                  "Người dùng"}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                {latestMessage.content}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs text-muted-foreground">
                            {getRelativeTime(latestMessage.created_at)}
                          </span>
                          {unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages View */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          {selectedConversation ? (
            <>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Cuộc trò chuyện
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {conversations[selectedConversation]?.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === selectedConversation
                          ? "justify-start"
                          : "justify-end"
                      }`}
                      onClick={() =>
                        message.status !== "read" &&
                        handleMarkAsRead(message.id)
                      }
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender_id === selectedConversation
                            ? "bg-muted"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {message.subject && (
                          <p className="font-medium text-sm mb-1">
                            {message.subject}
                          </p>
                        )}
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                          <span>{getRelativeTime(message.created_at)}</span>
                          <Badge variant="outline" className="text-xs">
                            {getMessageStatusLabel(message.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="h-full flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Chọn cuộc trò chuyện
                </h3>
                <p className="text-muted-foreground">
                  Chọn một cuộc trò chuyện từ danh sách bên trái để xem tin nhắn
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
