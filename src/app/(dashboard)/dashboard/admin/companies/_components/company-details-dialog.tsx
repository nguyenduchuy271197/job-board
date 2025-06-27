"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mail,
  Calendar,
  MapPin,
  Globe,
  Users,
  Check,
  X,
  ExternalLink,
} from "lucide-react";

import { getRelativeTime } from "@/constants/labels";
import type { CompanyDetails } from "@/types/custom.types";

interface CompanyDetailsDialogProps {
  company: CompanyDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CompanyDetailsDialog({
  company,
  open,
  onOpenChange,
}: CompanyDetailsDialogProps) {
  const getVerificationBadge = (verified: boolean) => {
    return verified ? (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Check className="h-3 w-3" />
        Đã xác minh
      </Badge>
    ) : (
      <Badge variant="outline" className="flex items-center gap-1">
        <X className="h-3 w-3" />
        Chờ xác minh
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết công ty</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company Header */}
          <div className="flex items-start gap-4 p-6 bg-muted/30 rounded-lg">
            <Avatar className="h-16 w-16">
              <AvatarImage src={company.logo_url || undefined} />
              <AvatarFallback className="text-lg">
                {company.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold">{company.name}</h3>
                {getVerificationBadge(company.verified)}
                {company.industry && (
                  <Badge variant="outline" className="capitalize">
                    {company.industry}
                  </Badge>
                )}
              </div>

              {company.email && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{company.email}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Thành lập {getRelativeTime(company.created_at)}</span>
              </div>

              {company.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{company.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Company Details Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="contact">Liên hệ</TabsTrigger>
              <TabsTrigger value="jobs">Việc làm</TabsTrigger>
              <TabsTrigger value="members">Thành viên</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Thông tin cơ bản</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Tên công ty:
                      </span>
                      <span className="font-medium">{company.name}</span>
                    </div>

                    {company.industry && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Ngành nghề:
                        </span>
                        <span className="capitalize">{company.industry}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Trạng thái</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Xác minh:</span>
                      {getVerificationBadge(company.verified)}
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Việc làm:</span>
                      <span>{company.jobs_count || 0} tin đăng</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Việc làm đang tuyển:
                      </span>
                      <span>{company.active_jobs_count || 0} tin</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ngày tạo:</span>
                      <span>
                        {new Date(company.created_at).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {company.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Mô tả công ty</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {company.description}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Thông tin liên hệ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {company.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{company.email}</span>
                      </div>
                    )}

                    {company.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {company.website}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Địa chỉ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {company.location && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm">{company.location}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="jobs" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Thống kê việc làm</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {company.jobs_count || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Tổng việc làm
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {company.active_jobs_count || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Đang tuyển
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {(company.jobs_count || 0) -
                          (company.active_jobs_count || 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Đã đóng
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        0
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Bản nháp
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {company.jobs && company.jobs.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Việc làm gần đây</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {company.jobs.slice(0, 5).map((job) => (
                        <div
                          key={job.id}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        >
                          <div>
                            <div className="font-medium text-sm">
                              {job.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {job.location} • {getRelativeTime(job.created_at)}
                            </div>
                          </div>
                          <Badge
                            variant={
                              job.status === "published"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {job.status === "published"
                              ? "Đang tuyển"
                              : "Đã đóng"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="members" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Thành viên công ty</CardTitle>
                </CardHeader>
                <CardContent>
                  {company.company_members &&
                  company.company_members.length > 0 ? (
                    <div className="space-y-3">
                      {company.company_members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={member.users?.avatar_url || undefined}
                            />
                            <AvatarFallback>
                              {member.users?.full_name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") ||
                                member.users?.email[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {member.users?.full_name || "Chưa cập nhật"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {member.users?.email}
                            </div>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {member.role}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Chưa có thành viên nào
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
