"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Save, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useUpdateProfile, useUploadAvatar } from "@/hooks/users";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/lib/validations";
import { FORM_LABELS } from "@/constants/labels";
import type { User } from "@/types/custom.types";

interface ProfileEditDialogProps {
  user: User;
}

export function ProfileEditDialog({ user }: ProfileEditDialogProps) {
  const [open, setOpen] = useState(false);
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: user.full_name || "",
      phone: user.phone || "",
      location: user.location || "",
      bio: user.bio || "",
      linkedinUrl: user.linkedin_url || "",
      portfolioUrl: user.portfolio_url || "",
    },
  });

  const onSubmit = async (data: UpdateProfileInput) => {
    try {
      const result = await updateProfileMutation.mutateAsync(data);

      if (result.success) {
        toast.success("Cập nhật hồ sơ thành công");
        setOpen(false);
        form.reset(data);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Cập nhật hồ sơ thất bại");
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file không được vượt quá 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Chỉ cho phép tải lên file hình ảnh");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const result = await uploadAvatarMutation.mutateAsync(formData);

      if (result.success) {
        toast.success("Cập nhật ảnh đại diện thành công");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Tải ảnh đại diện thất bại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Chỉnh sửa hồ sơ
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cá nhân và hồ sơ nghề nghiệp của bạn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback>
                {user.full_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || user.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                id="avatar-upload"
              />
              <label htmlFor="avatar-upload">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadAvatarMutation.isPending}
                  asChild
                >
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadAvatarMutation.isPending
                      ? "Đang tải..."
                      : "Thay đổi ảnh"}
                  </span>
                </Button>
              </label>
            </div>
          </div>

          {/* Profile Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.full_name}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Họ và tên đầy đủ" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.phone}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="0123456789" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.location}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Thành phố, tỉnh" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới thiệu</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Mô tả ngắn về bản thân, kinh nghiệm và mục tiêu nghề nghiệp..."
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedinUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="portfolioUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://yourportfolio.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateProfileMutation.isPending
                    ? "Đang lưu..."
                    : "Lưu thay đổi"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
