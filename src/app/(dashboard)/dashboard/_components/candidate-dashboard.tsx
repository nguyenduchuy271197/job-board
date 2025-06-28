"use client";

import {
  FileText,
  Briefcase,
  BookmarkCheck,
  TrendingUp,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  ArrowRight,
  Search,
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
import type { User } from "@/types/custom.types";

interface CandidateDashboardProps {
  user: User;
}

export function CandidateDashboard({ user }: CandidateDashboardProps) {
  // Mock data - replace with real data from hooks
  const stats = {
    applications: 12,
    savedJobs: 8,
    profileViews: 45,
    profileCompleted: 75,
  };

  const recentApplications = [
    {
      id: "1",
      jobTitle: "Frontend Developer",
      company: "TechCorp",
      appliedAt: "2 ngày trước",
      status: "reviewing" as const,
      logo: "/placeholder-logo.png",
    },
    {
      id: "2",
      jobTitle: "React Developer",
      company: "StartupXYZ",
      appliedAt: "5 ngày trước",
      status: "interview" as const,
      logo: "/placeholder-logo.png",
    },
    {
      id: "3",
      jobTitle: "UI/UX Designer",
      company: "Design Co",
      appliedAt: "1 tuần trước",
      status: "rejected" as const,
      logo: "/placeholder-logo.png",
    },
  ];

  const suggestedJobs = [
    {
      id: "1",
      title: "Senior Frontend Developer",
      company: "Innovative Tech",
      location: "Hồ Chí Minh",
      salary: "25-30 triệu",
      type: "Full-time",
      posted: "1 ngày trước",
      matchScore: 95,
    },
    {
      id: "2",
      title: "React Native Developer",
      company: "Mobile First",
      location: "Hà Nội",
      salary: "20-28 triệu",
      type: "Full-time",
      posted: "3 ngày trước",
      matchScore: 88,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "reviewing":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "interview":
        return <Eye className="h-4 w-4 text-blue-500" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "reviewing":
        return "Đang xem xét";
      case "interview":
        return "Mời phỏng vấn";
      case "accepted":
        return "Được tuyển";
      case "rejected":
        return "Bị từ chối";
      default:
        return "Chưa xác định";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reviewing":
        return "default";
      case "interview":
        return "default";
      case "accepted":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Chào mừng trở lại, ${user.full_name || "Bạn"}!`}
        description="Theo dõi hoạt động tìm việc và cơ hội mới"
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn ứng tuyển</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.applications}</div>
            <p className="text-xs text-muted-foreground">+2 từ tuần trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Việc làm đã lưu
            </CardTitle>
            <BookmarkCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.savedJobs}</div>
            <p className="text-xs text-muted-foreground">+1 từ tuần trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lượt xem hồ sơ
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.profileViews}</div>
            <p className="text-xs text-muted-foreground">+12 từ tuần trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hoàn thành hồ sơ
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.profileCompleted}%</div>
            <Progress value={stats.profileCompleted} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Đơn ứng tuyển gần đây</CardTitle>
                <CardDescription>
                  Theo dõi trạng thái các đơn ứng tuyển của bạn
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/ung-tuyen">
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
                  className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={application.logo} />
                    <AvatarFallback>
                      {application.company.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {application.jobTitle}
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-muted-foreground">
                        {application.company}
                      </p>
                      <span className="text-sm text-muted-foreground">•</span>
                      <p className="text-sm text-muted-foreground">
                        {application.appliedAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getStatusIcon(application.status)}
                    <Badge variant={getStatusColor(application.status)}>
                      {getStatusLabel(application.status)}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold">
                  Chưa có đơn ứng tuyển
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Bắt đầu tìm kiếm và ứng tuyển việc làm phù hợp
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/viec-lam">
                    <Search className="mr-2 h-4 w-4" />
                    Tìm việc làm
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Suggested Jobs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Việc làm gợi ý</CardTitle>
                <CardDescription>
                  Các cơ hội việc làm phù hợp với hồ sơ của bạn
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/viec-lam">
                  Xem thêm
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestedJobs.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm">{job.title}</h3>
                  <Badge
                    variant="secondary"
                    className="bg-green-50 text-green-700"
                  >
                    {job.matchScore}% phù hợp
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-2">
                  {job.company}
                </p>

                <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                  <span>📍 {job.location}</span>
                  <span>💰 {job.salary}</span>
                  <span>🕐 {job.type}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {job.posted}
                  </span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <BookmarkCheck className="h-3 w-3 mr-1" />
                      Lưu
                    </Button>
                    <Button size="sm">Ứng tuyển</Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hành động nhanh</CardTitle>
          <CardDescription>
            Các thao tác thường dùng để cải thiện hồ sơ và tìm việc
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              asChild
            >
              <Link href="/dashboard/cv">
                <div className="flex items-center space-x-3">
                  <Plus className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Tạo CV mới</p>
                    <p className="text-sm text-muted-foreground">
                      Tạo CV chuyên nghiệp với template
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
              <Link href="/dashboard/ho-so">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Hoàn thiện hồ sơ</p>
                    <p className="text-sm text-muted-foreground">
                      Tăng cơ hội được nhà tuyển dụng chú ý
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
              <Link href="/dashboard/viec-lam">
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Tìm việc làm</p>
                    <p className="text-sm text-muted-foreground">
                      Khám phá cơ hội việc làm mới
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
