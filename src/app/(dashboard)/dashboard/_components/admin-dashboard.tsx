"use client";

import {
  Users,
  Building2,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  Activity,
  ArrowRight,
  Eye,
  Settings,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/page-header";
import Link from "next/link";

export function AdminDashboard() {
  // Mock data - replace with real data from hooks
  const systemStats = {
    totalUsers: 1247,
    totalCompanies: 89,
    totalJobs: 456,
    pendingApprovals: 23,
  };

  const pendingApprovals = [
    {
      id: "1",
      type: "company" as const,
      title: "TechCorp Vietnam",
      submittedAt: "2 giờ trước",
      priority: "high" as const,
    },
    {
      id: "2",
      type: "job" as const,
      title: "Senior Frontend Developer - StartupXYZ",
      submittedAt: "4 giờ trước",
      priority: "medium" as const,
    },
    {
      id: "3",
      type: "company" as const,
      title: "Digital Solutions Ltd",
      submittedAt: "6 giờ trước",
      priority: "low" as const,
    },
  ];

  const recentActivities = [
    {
      id: "1",
      type: "user_registration",
      description: "5 người dùng mới đăng ký",
      timestamp: "10 phút trước",
      icon: Users,
    },
    {
      id: "2",
      type: "job_posted",
      description: "3 tin tuyển dụng mới được đăng",
      timestamp: "1 giờ trước",
      icon: Briefcase,
    },
    {
      id: "3",
      type: "company_verified",
      description: "TechStart đã được xác minh",
      timestamp: "3 giờ trước",
      icon: CheckCircle,
    },
    {
      id: "4",
      type: "content_flagged",
      description: "1 nội dung bị báo cáo vi phạm",
      timestamp: "5 giờ trước",
      icon: AlertTriangle,
    },
  ];

  const systemHealth = {
    uptime: 99.9,
    responseTime: 145,
    errorRate: 0.01,
    activeUsers: 89,
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "company":
        return <Building2 className="h-4 w-4" />;
      case "job":
        return <Briefcase className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "company":
        return "Công ty";
      case "job":
        return "Việc làm";
      default:
        return "Khác";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Cao";
      case "medium":
        return "Trung bình";
      case "low":
        return "Thấp";
      default:
        return "Bình thường";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Quản lý và giám sát hoạt động hệ thống"
        action={
          <Button variant="outline" asChild>
            <Link href="/admin/cai-dat">
              <Settings className="mr-2 h-4 w-4" />
              Cài đặt hệ thống
            </Link>
          </Button>
        }
      />

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng người dùng
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemStats.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">+12% từ tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Công ty</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemStats.totalCompanies}
            </div>
            <p className="text-xs text-muted-foreground">+5 từ tuần trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Việc làm</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalJobs}</div>
            <p className="text-xs text-muted-foreground">+23 từ tuần trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemStats.pendingApprovals}
            </div>
            <p className="text-xs text-muted-foreground">Cần xem xét</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Chờ phê duyệt</CardTitle>
                <CardDescription>
                  Các nội dung cần được xem xét và phê duyệt
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/phe-duyet">
                  Xem tất cả
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingApprovals.length > 0 ? (
              pendingApprovals.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex-shrink-0">{getTypeIcon(item.type)}</div>

                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {item.title}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{getTypeLabel(item.type)}</Badge>
                      <span className="text-sm text-muted-foreground">•</span>
                      <p className="text-sm text-muted-foreground">
                        {item.submittedAt}
                      </p>
                    </div>
                  </div>

                  <Badge variant={getPriorityColor(item.priority)}>
                    {getPriorityLabel(item.priority)}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <h3 className="mt-2 text-sm font-semibold">
                  Tất cả đã được duyệt
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Hiện tại không có nội dung nào cần phê duyệt
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Hoạt động gần đây</CardTitle>
                <CardDescription>
                  Các sự kiện và hoạt động mới nhất trên hệ thống
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/nhat-ky">
                  Xem chi tiết
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <activity.icon className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Tình trạng hệ thống
          </CardTitle>
          <CardDescription>
            Các chỉ số hiệu suất và tình trạng hoạt động của hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uptime</span>
                <span className="text-sm text-green-600 font-medium">
                  {systemHealth.uptime}%
                </span>
              </div>
              <Progress value={systemHealth.uptime} className="h-2" />
              <p className="text-xs text-muted-foreground">Hoạt động ổn định</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Response Time</span>
                <span className="text-sm font-medium">
                  {systemHealth.responseTime}ms
                </span>
              </div>
              <Progress value={70} className="h-2" />
              <p className="text-xs text-muted-foreground">Phản hồi nhanh</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Error Rate</span>
                <span className="text-sm text-green-600 font-medium">
                  {systemHealth.errorRate}%
                </span>
              </div>
              <Progress value={1} className="h-2" />
              <p className="text-xs text-muted-foreground">Tỷ lệ lỗi thấp</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Users</span>
                <span className="text-sm font-medium">
                  {systemHealth.activeUsers}
                </span>
              </div>
              <Progress value={65} className="h-2" />
              <p className="text-xs text-muted-foreground">Đang online</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hành động nhanh</CardTitle>
          <CardDescription>Các tác vụ quản trị thường dùng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              asChild
            >
              <Link href="/admin/nguoi-dung">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Quản lý người dùng</p>
                    <p className="text-sm text-muted-foreground">
                      Xem và quản lý tài khoản người dùng
                    </p>
                  </div>
                </div>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              asChild
            >
              <Link href="/admin/cong-ty">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Quản lý công ty</p>
                    <p className="text-sm text-muted-foreground">
                      Xác minh và quản lý thông tin công ty
                    </p>
                  </div>
                </div>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              asChild
            >
              <Link href="/admin/viec-lam">
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Kiểm duyệt việc làm</p>
                    <p className="text-sm text-muted-foreground">
                      Duyệt và quản lý tin tuyển dụng
                    </p>
                  </div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
