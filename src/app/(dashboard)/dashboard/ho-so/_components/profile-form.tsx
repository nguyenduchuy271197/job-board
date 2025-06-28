"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useUpdateProfile, useUploadAvatar } from "@/hooks/users";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/lib/validations/schemas/user.schema";
import { User as UserType } from "@/types/custom.types";

interface ProfileFormProps {
  user: UserType;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty },
    reset,
  } = useForm<UpdateProfileInput>({
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh hợp lệ");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Kích thước file không được vượt quá 5MB");
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("avatar", selectedFile);
      const result = await uploadAvatarMutation.mutateAsync(formData);
      if (result.success) {
        toast.success("Cập nhật ảnh đại diện thành công!");
        handleRemoveImage();
      } else {
        toast.error("Cập nhật ảnh đại diện thất bại", {
          description: result.error,
        });
      }
    } catch {
      toast.error("Đã có lỗi xảy ra khi tải ảnh lên");
    }
  };

  const onSubmit = async (data: UpdateProfileInput) => {
    try {
      const result = await updateProfileMutation.mutateAsync(data);

      if (result.success) {
        toast.success("Cập nhật hồ sơ thành công!");
        reset(data); // Reset form with new values
      } else {
        toast.error("Cập nhật hồ sơ thất bại", {
          description: result.error,
        });
      }
    } catch {
      toast.error("Đã có lỗi xảy ra", {
        description: "Vui lòng thử lại sau.",
      });
    }
  };

  const getUserInitials = () => {
    const name = user.full_name || user.email;
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={previewUrl || user.avatar_url || undefined} />
                <AvatarFallback className="text-lg">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>

              {previewUrl && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={handleRemoveImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Ảnh đại diện</h3>
              <p className="text-sm text-muted-foreground">
                Tải lên ảnh đại diện của bạn. Kích thước tối đa 5MB.
              </p>

              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="avatar-upload"
                />

                <Label htmlFor="avatar-upload" asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Chọn ảnh
                  </Button>
                </Label>

                {selectedFile && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleUploadAvatar}
                    disabled={uploadAvatarMutation.isPending}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadAvatarMutation.isPending ? "Đang tải..." : "Tải lên"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="full_name">Họ và tên *</Label>
            <Input
              id="full_name"
              placeholder="Nhập họ và tên của bạn"
              {...register("fullName")}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="0987654321"
              {...register("phone")}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Địa chỉ</Label>
            <Input
              id="location"
              placeholder="Thành phố, Quốc gia"
              {...register("location")}
            />
          </div>

          {/* LinkedIn URL */}
          <div className="space-y-2">
            <Label htmlFor="linkedin_url">LinkedIn</Label>
            <Input
              id="linkedin_url"
              type="url"
              placeholder="https://linkedin.com/in/yourprofile"
              {...register("linkedinUrl")}
            />
          </div>
        </div>

        {/* Portfolio URL */}
        <div className="space-y-2">
          <Label htmlFor="portfolio_url">Website/Portfolio</Label>
          <Input
            id="portfolio_url"
            type="url"
            placeholder="https://yourportfolio.com"
            {...register("portfolioUrl")}
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Giới thiệu bản thân</Label>
          <Textarea
            id="bio"
            placeholder="Giới thiệu về bản thân, kinh nghiệm và mục tiêu nghề nghiệp..."
            rows={4}
            {...register("bio")}
          />
          <p className="text-xs text-muted-foreground">Tối đa 500 ký tự</p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật hồ sơ"}
          </Button>
        </div>
      </form>
    </div>
  );
}
