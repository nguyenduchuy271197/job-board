"use client";

import { User } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfileForm } from "./profile-form";
import { User as UserType } from "@/types/custom.types";

interface ProfileTabsProps {
  user: UserType;
}

export function ProfileTabs({ user }: ProfileTabsProps) {
  const getRoleDisplayName = () => {
    switch (user.role) {
      case "candidate":
        return "Ứng viên";
      case "employer":
        return "Nhà tuyển dụng";
      case "admin":
        return "Quản trị viên";
      default:
        return "Người dùng";
    }
  };

  const getRoleBadgeColor = () => {
    switch (user.role) {
      case "candidate":
        return "default";
      case "employer":
        return "secondary";
      case "admin":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* User Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {user.full_name || "Chưa cập nhật tên"}
                <Badge variant={getRoleBadgeColor()}>
                  {getRoleDisplayName()}
                </Badge>
              </CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Tham gia:{" "}
                {new Date(user.created_at || "").toLocaleDateString("vi-VN")}
              </p>
              {user.is_active ? (
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  Đang hoạt động
                </Badge>
              ) : (
                <Badge variant="secondary">Tạm ngưng</Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Thông tin cá nhân
          </CardTitle>
          <CardDescription>
            Cập nhật thông tin cá nhân và liên hệ của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} />
        </CardContent>
      </Card>
    </div>
  );
}
