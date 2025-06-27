"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, DollarSign, Users, Clock, Building, Tag } from "lucide-react";
import {
  getJobStatusLabel,
  getEmploymentTypeLabel,
  getExperienceLevelLabel,
  getRelativeTime,
  formatSalary,
} from "@/constants/labels";
import type { JobWithCompanyAndSkills } from "@/types/custom.types";

interface JobDetailsDialogProps {
  job: JobWithCompanyAndSkills;
  isOpen: boolean;
  onClose: () => void;
}

export function JobDetailsDialog({
  job,
  isOpen,
  onClose,
}: JobDetailsDialogProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      case "paused":
        return "outline";
      case "closed":
        return "destructive";
      case "expired":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết tin tuyển dụng</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building className="h-4 w-4" />
                  <span>{job.companies.name}</span>
                </div>
              </div>
              <Badge variant={getStatusBadgeVariant(job.status)}>
                {getJobStatusLabel(job.status)}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {job.location || "Không xác định"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {formatSalary(
                    job.salary_min ?? undefined,
                    job.salary_max ?? undefined,
                    job.currency
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {getEmploymentTypeLabel(job.employment_type)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {getExperienceLevelLabel(job.experience_level)}
                </span>
              </div>
            </div>
          </div>

          {/* Job Details Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="requirements">Yêu cầu</TabsTrigger>
              <TabsTrigger value="company">Công ty</TabsTrigger>
              <TabsTrigger value="stats">Thống kê</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mô tả công việc</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {job.description ? (
                      <div className="whitespace-pre-wrap">
                        {job.description}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        Chưa có mô tả công việc
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {job.job_skills && job.job_skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Kỹ năng yêu cầu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {job.job_skills.map((jobSkill) => (
                        <Badge
                          key={jobSkill.id}
                          variant={jobSkill.is_required ? "default" : "outline"}
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {jobSkill.skills.name}
                          {jobSkill.is_required && " *"}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      * Kỹ năng bắt buộc
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="requirements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Yêu cầu công việc</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {job.requirements ? (
                      <div className="whitespace-pre-wrap">
                        {job.requirements}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        Chưa có yêu cầu cụ thể
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin cơ bản</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Loại hình:</span>
                      <span>{getEmploymentTypeLabel(job.employment_type)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Kinh nghiệm:
                      </span>
                      <span>
                        {getExperienceLevelLabel(job.experience_level)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Làm từ xa:</span>
                      <span>{job.is_remote ? "Có" : "Không"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Địa điểm:</span>
                      <span>{job.location || "Không xác định"}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Mức lương</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tối thiểu:</span>
                      <span>
                        {job.salary_min
                          ? `${job.salary_min?.toLocaleString()} ${
                              job.currency
                            }`
                          : "Không xác định"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tối đa:</span>
                      <span>
                        {job.salary_max
                          ? `${job.salary_max?.toLocaleString()} ${
                              job.currency
                            }`
                          : "Không xác định"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Đơn vị:</span>
                      <span>{job.currency}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="company" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin công ty</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold">{job.companies.name}</h3>
                      {job.companies.industry && (
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm capitalize">
                            {job.companies.industry}
                          </span>
                        </div>
                      )}
                      {job.companies.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {job.companies.location}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {job.companies.description && (
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap">
                        {job.companies.description}
                      </div>
                    </div>
                  )}

                  {job.companies.website && (
                    <div>
                      <a
                        href={job.companies.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {job.companies.website}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Ứng tuyển</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {job.application_count}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tổng số ứng tuyển
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ngày tạo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      {new Date(job.created_at).toLocaleDateString("vi-VN")}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getRelativeTime(job.created_at)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ngày đăng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      {job.published_at
                        ? new Date(job.published_at).toLocaleDateString("vi-VN")
                        : "Chưa đăng"}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {job.published_at
                        ? getRelativeTime(job.published_at)
                        : "Tin đăng chưa được xuất bản"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
