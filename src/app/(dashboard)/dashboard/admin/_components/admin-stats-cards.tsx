"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building,
  Briefcase,
  FileText,
  UserCheck,
  Building2,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { useStats } from "@/hooks/admin/dashboard";
import { Loading } from "@/components/shared/loading";

export function AdminStatsCards() {
  const { data: statsData, isLoading, error } = useStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Loading />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !statsData?.success || !statsData.data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Không thể tải thống kê
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = statsData.data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Users Stats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Người dùng</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.users.total.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              <UserCheck className="h-3 w-3 mr-1" />
              {stats.users.active} hoạt động
            </Badge>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-muted-foreground">
              +{stats.users.new_this_month} tháng này
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Companies Stats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Công ty</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.companies.total.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              {stats.companies.verified} đã duyệt
            </Badge>
            <Badge variant="outline" className="text-xs">
              <XCircle className="h-3 w-3 mr-1" />
              {stats.companies.pending_verification} chờ duyệt
            </Badge>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-muted-foreground">
              +{stats.companies.new_this_month} tháng này
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Stats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Việc làm</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.jobs.total.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              {stats.jobs.published} đang tuyển
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Building2 className="h-3 w-3 mr-1" />
              {stats.jobs.draft} bản nháp
            </Badge>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-muted-foreground">
              +{stats.jobs.new_this_month} tháng này
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Applications Stats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ứng tuyển</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.applications.total.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              {stats.applications.submitted} đã nộp
            </Badge>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-muted-foreground">
              +{stats.applications.new_this_month} tháng này
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
