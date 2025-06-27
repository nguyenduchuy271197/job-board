"use client";

import Link from "next/link";
import { Heart, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptySavedJobsProps {
  hasFilters: boolean;
}

export function EmptySavedJobs({ hasFilters }: EmptySavedJobsProps) {
  if (hasFilters) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="rounded-full bg-muted p-6">
            <Filter className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              Không tìm thấy việc làm nào
            </h3>
            <p className="text-muted-foreground max-w-md">
              Không có việc làm đã lưu nào phù hợp với bộ lọc hiện tại. Hãy thử
              điều chỉnh bộ lọc hoặc xóa bộ lọc để xem tất cả việc làm đã lưu.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" asChild>
              <Link href="/jobs">
                <Search className="h-4 w-4 mr-2" />
                Tìm việc làm mới
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-6">
        <div className="rounded-full bg-muted p-8">
          <Heart className="h-16 w-16 text-muted-foreground" />
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold">
            Chưa có việc làm nào được lưu
          </h3>
          <p className="text-muted-foreground max-w-lg">
            Bạn chưa lưu việc làm nào. Hãy khám phá các cơ hội nghề nghiệp và
            lưu những việc làm thú vị để theo dõi và ứng tuyển sau.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild>
            <Link href="/jobs">
              <Search className="h-4 w-4 mr-2" />
              Khám phá việc làm
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Về Dashboard</Link>
          </Button>
        </div>

        <div className="mt-8 p-4 bg-muted/50 rounded-lg max-w-md">
          <h4 className="font-medium mb-2">💡 Mẹo:</h4>
          <p className="text-sm text-muted-foreground">
            Khi xem chi tiết việc làm, nhấn vào biểu tượng trái tim ❤️ để lưu
            việc làm vào danh sách yêu thích của bạn.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
