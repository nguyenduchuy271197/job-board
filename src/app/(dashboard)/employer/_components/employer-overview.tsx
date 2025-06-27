"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Users,
  Eye,
  MessageSquare,
  TrendingUp,
  Plus,
} from "lucide-react";
import Link from "next/link";

export function EmployerOverview() {
  // Mock data - in real app, this would come from API
  const stats = {
    activeJobs: 5,
    totalApplications: 23,
    jobViews: 150,
    messages: 8,
  };

  const recentActivity = [
    {
      id: 1,
      type: "application",
      message: "Nguyễn Văn A đã ứng tuyển vào Frontend Developer",
      time: "2 giờ trước",
    },
    {
      id: 2,
      type: "view",
      message: "Tin tuyển dụng Backend Developer được xem 15 lần",
      time: "4 giờ trước",
    },
    {
      id: 3,
      type: "message",
      message: "Tin nhắn mới từ Trần Thị B",
      time: "6 giờ trước",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Việc làm đang tuyển
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> từ tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn ứng tuyển</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5</span> trong tuần này
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lượt xem việc làm
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.jobViews}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> so với tuần trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tin nhắn chưa đọc
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.messages}</div>
            <p className="text-xs text-muted-foreground">Cần phản hồi</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start">
              <Link href="/employer/jobs/create">
                <Plus className="mr-2 h-4 w-4" />
                Đăng tin tuyển dụng mới
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/employer/applications">
                <Users className="mr-2 h-4 w-4" />
                Xem đơn ứng tuyển
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/employer/candidates">
                <Eye className="mr-2 h-4 w-4" />
                Tìm kiếm ứng viên
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/employer/company">
                <TrendingUp className="mr-2 h-4 w-4" />
                Cập nhật thông tin công ty
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {activity.type === "application" && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    )}
                    {activity.type === "view" && (
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    )}
                    {activity.type === "message" && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
