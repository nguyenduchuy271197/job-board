import { Calendar, Mail, MapPin, Phone, Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserRoleLabel } from "@/constants/labels";
import type { User } from "@/types/custom.types";

interface ProfileViewProps {
  user: User;
}

export function ProfileView({ user }: ProfileViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Basic Info */}
      <Card className="lg:col-span-1">
        <CardHeader className="text-center">
          <Avatar className="w-24 h-24 mx-auto">
            <AvatarImage src={user.avatar_url || undefined} />
            <AvatarFallback className="text-lg">
              {user.full_name
                ?.split(" ")
                .map((n) => n[0])
                .join("") || user.email[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="mt-4">
            {user.full_name || "Chưa cập nhật"}
          </CardTitle>
          <Badge variant="secondary">{getUserRoleLabel(user.role)}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3 text-sm">
            <Mail className="h-4 w-4 text-slate-500" />
            <span>{user.email}</span>
          </div>

          {user.phone && (
            <div className="flex items-center space-x-3 text-sm">
              <Phone className="h-4 w-4 text-slate-500" />
              <span>{user.phone}</span>
            </div>
          )}

          {user.location && (
            <div className="flex items-center space-x-3 text-sm">
              <MapPin className="h-4 w-4 text-slate-500" />
              <span>{user.location}</span>
            </div>
          )}

          {user.portfolio_url && (
            <div className="flex items-center space-x-3 text-sm">
              <Globe className="h-4 w-4 text-slate-500" />
              <a
                href={user.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Website
              </a>
            </div>
          )}

          <div className="flex items-center space-x-3 text-sm">
            <Calendar className="h-4 w-4 text-slate-500" />
            <span>
              Tham gia {new Date(user.created_at).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>Giới thiệu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">
              {user.bio || "Chưa có thông tin giới thiệu"}
            </p>
          </CardContent>
        </Card>

        {/* LinkedIn */}
        {user.linkedin_url && (
          <Card>
            <CardHeader>
              <CardTitle>Liên kết chuyên nghiệp</CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={user.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center space-x-2"
              >
                <span>LinkedIn Profile</span>
              </a>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
