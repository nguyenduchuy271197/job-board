import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Eye, Clock } from "lucide-react";
import { AdminStatsCards } from "./_components/admin-stats-cards";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tổng quan quản trị | Jobboard",
  description:
    "Bảng điều khiển admin - Theo dõi và quản lý toàn bộ hệ thống tuyển dụng. Thống kê người dùng, công ty, việc làm.",
  keywords: ["admin", "quản trị", "thống kê", "dashboard", "quản lý hệ thống"],
  openGraph: {
    title: "Tổng quan quản trị | Jobboard",
    description:
      "Bảng điều khiển admin - Theo dõi và quản lý toàn bộ hệ thống tuyển dụng. Thống kê người dùng, công ty, việc làm.",
    type: "website",
  },
};

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tổng quan quản trị"
        description="Theo dõi và quản lý toàn bộ hệ thống"
      />

      <AdminStatsCards />

      {/* Recent Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Xu hướng tăng trưởng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Người dùng mới (tháng)
                </span>
                <Badge variant="secondary">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Công ty mới (tháng)
                </span>
                <Badge variant="secondary">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Việc làm mới (tháng)
                </span>
                <Badge variant="secondary">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Cần xử lý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Công ty chờ duyệt
                </span>
                <Badge variant="outline">
                  <Eye className="h-3 w-3 mr-1" />
                  Xem chi tiết
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Việc làm báo cáo
                </span>
                <Badge variant="outline">
                  <Eye className="h-3 w-3 mr-1" />
                  Xem chi tiết
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Tài khoản cần kiểm tra
                </span>
                <Badge variant="outline">
                  <Eye className="h-3 w-3 mr-1" />
                  Xem chi tiết
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
