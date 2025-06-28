"use client";

import {
  Users,
  Briefcase,
  TrendingUp,
  Eye,
  Plus,
  ArrowRight,
  Clock,
  FileText,
  Building2,
  BarChart3,
  MessageSquare,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/shared/page-header";
import Link from "next/link";

export function EmployerDashboard() {
  // Mock data - replace with real data from hooks
  const stats = {
    activeJobs: 5,
    totalApplications: 89,
    newApplications: 12,
    profileViews: 234,
  };

  const recentApplications = [
    {
      id: "1",
      candidateName: "Nguyễn Văn A",
      jobTitle: "Frontend Developer",
      appliedAt: "2 giờ trước",
      status: "new" as const,
      avatar: "/placeholder-avatar.png",
      experience: "3 năm",
    },
    {
      id: "2",
      candidateName: "Trần Thị B",
      jobTitle: "React Developer",
      appliedAt: "5 giờ trước",
      status: "reviewing" as const,
      avatar: "/placeholder-avatar.png",
      experience: "2 năm",
    },
    {
      id: "3",
      candidateName: "Lê Văn C",
      jobTitle: "UI/UX Designer",
      appliedAt: "1 ngày trước",
      status: "interview" as const,
      avatar: "/placeholder-avatar.png",
      experience: "4 năm",
    },
  ];

  const activeJobs = [
    {
      id: "1",
      title: "Senior Frontend Developer",
      applicationsCount: 24,
      viewsCount: 156,
      status: "published" as const,
      postedAt: "3 ngày trước",
      expiresAt: "27 ngày nữa",
    },
    {
      id: "2",
      title: "React Native Developer",
      applicationsCount: 18,
      viewsCount: 98,
      status: "published" as const,
      postedAt: "1 tuần trước",
      expiresAt: "23 ngày nữa",
    },
    {
      id: "3",
      title: "Product Designer",
      applicationsCount: 31,
      viewsCount: 203,
      status: "published" as const,
      postedAt: "2 tuần trước",
      expiresAt: "16 ngày nữa",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
      case "reviewing":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "interview":
        return <Eye className="h-4 w-4 text-green-500" />;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new":
        return "Mới";
      case "reviewing":
        return "Đang xem xét";
      case "interview":
        return "Phỏng vấn";
      default:
        return "Chưa xác định";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Chào mừng trở lại!`}
        description="Quản lý tuyển dụng và theo dõi ứng viên"
        action={
          <Button asChild>
            <Link href="/dashboard/tin-tuyen-dung/tao-moi">
              <Plus className="mr-2 h-4 w-4" />
              Đăng tin tuyển dụng
            </Link>
          </Button>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tin đang tuyển
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">+1 từ tuần trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng ứng viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">+15 từ tuần trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ứng viên mới</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newApplications}</div>
            <p className="text-xs text-muted-foreground">+3 từ hôm qua</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lượt xem tin</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.profileViews}</div>
            <p className="text-xs text-muted-foreground">+28 từ tuần trước</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Ứng viên mới</CardTitle>
                <CardDescription>
                  Các ứng viên vừa nộp đơn ứng tuyển
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/ung-vien">
                  Xem tất cả
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentApplications.length > 0 ? (
              recentApplications.map((application) => (
                <div
                  key={application.id}
                  className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={application.avatar} />
                    <AvatarFallback>
                      {application.candidateName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {application.candidateName}
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-muted-foreground">
                        {application.jobTitle}
                      </p>
                      <span className="text-sm text-muted-foreground">•</span>
                      <p className="text-sm text-muted-foreground">
                        {application.experience}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getStatusIcon(application.status)}
                    <div className="text-right">
                      <Badge variant="secondary">
                        {getStatusLabel(application.status)}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {application.appliedAt}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold">
                  Chưa có ứng viên mới
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Khi có ứng viên nộp đơn, bạn sẽ thấy thông tin ở đây
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Jobs Performance */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tin tuyển dụng hoạt động</CardTitle>
                <CardDescription>
                  Hiệu suất của các tin đăng đang hoạt động
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/tin-tuyen-dung">
                  Quản lý
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeJobs.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium text-sm">{job.title}</h3>
                  <Badge
                    variant="default"
                    className="bg-green-50 text-green-700"
                  >
                    Đang hoạt động
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <p className="text-lg font-semibold">
                      {job.applicationsCount}
                    </p>
                    <p className="text-xs text-muted-foreground">Ứng viên</p>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <p className="text-lg font-semibold">{job.viewsCount}</p>
                    <p className="text-xs text-muted-foreground">Lượt xem</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Đăng {job.postedAt}</span>
                  <span>Hết hạn {job.expiresAt}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Hiệu suất tuyển dụng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Tỷ lệ ứng tuyển</span>
                <span className="text-sm font-medium">4.2%</span>
              </div>
              <Progress value={42} className="h-2" />

              <div className="flex items-center justify-between">
                <span className="text-sm">Tỷ lệ phỏng vấn</span>
                <span className="text-sm font-medium">15%</span>
              </div>
              <Progress value={15} className="h-2" />

              <div className="flex items-center justify-between">
                <span className="text-sm">Tỷ lệ tuyển dụng</span>
                <span className="text-sm font-medium">8%</span>
              </div>
              <Progress value={8} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Xu hướng tuần này
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Lượt xem tin</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-sm font-medium text-green-600">
                    +12%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Đơn ứng tuyển</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-sm font-medium text-green-600">
                    +8%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Chất lượng ứng viên</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-sm font-medium text-green-600">
                    +5%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Hoạt động gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">Phỏng vấn sắp tới</p>
                <p className="text-muted-foreground">
                  3 lịch hẹn trong tuần này
                </p>
              </div>

              <div className="text-sm">
                <p className="font-medium">Tin nhắn chưa đọc</p>
                <p className="text-muted-foreground">7 tin nhắn từ ứng viên</p>
              </div>

              <div className="text-sm">
                <p className="font-medium">Tin sắp hết hạn</p>
                <p className="text-muted-foreground">2 tin trong 10 ngày tới</p>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full mt-4" asChild>
              <Link href="/dashboard/tin-nhan">Xem chi tiết</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hành động nhanh</CardTitle>
          <CardDescription>
            Các thao tác thường dùng để quản lý tuyển dụng hiệu quả
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              asChild
            >
              <Link href="/dashboard/tin-tuyen-dung/tao-moi">
                <div className="flex items-center space-x-3">
                  <Plus className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Đăng tin tuyển dụng</p>
                    <p className="text-sm text-muted-foreground">
                      Tạo tin tuyển dụng mới để tìm ứng viên
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
              <Link href="/dashboard/tim-ung-vien">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Tìm ứng viên</p>
                    <p className="text-sm text-muted-foreground">
                      Tìm kiếm chủ động ứng viên phù hợp
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
              <Link href="/dashboard/cong-ty">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Cập nhật công ty</p>
                    <p className="text-sm text-muted-foreground">
                      Hoàn thiện thông tin để thu hút ứng viên
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
