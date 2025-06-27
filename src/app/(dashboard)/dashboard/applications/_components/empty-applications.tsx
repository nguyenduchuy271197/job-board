"use client";

import { FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ApplicationStatus } from "@/types/custom.types";

interface EmptyApplicationsProps {
  statusFilter?: ApplicationStatus;
}

export default function EmptyApplications({
  statusFilter,
}: EmptyApplicationsProps) {
  const getEmptyMessage = () => {
    if (statusFilter) {
      switch (statusFilter) {
        case "submitted":
          return {
            title: "Chưa có đơn ứng tuyển nào đã nộp",
            description:
              "Bạn chưa nộp đơn ứng tuyển nào. Hãy tìm kiếm và ứng tuyển vào các vị trí phù hợp.",
          };
        case "reviewing":
          return {
            title: "Chưa có đơn nào đang được xem xét",
            description:
              "Chưa có đơn ứng tuyển nào đang trong quá trình xem xét.",
          };
        case "interview":
          return {
            title: "Chưa có lịch phỏng vấn",
            description: "Bạn chưa được mời phỏng vấn cho vị trí nào.",
          };
        case "offer":
          return {
            title: "Chưa nhận được offer nào",
            description:
              "Bạn chưa nhận được offer làm việc từ nhà tuyển dụng nào.",
          };
        case "rejected":
          return {
            title: "Chưa có đơn nào bị từ chối",
            description:
              "May mắn thay, bạn chưa có đơn ứng tuyển nào bị từ chối.",
          };
        case "withdrawn":
          return {
            title: "Chưa rút đơn nào",
            description: "Bạn chưa rút đơn ứng tuyển nào.",
          };
        default:
          return {
            title: "Không tìm thấy đơn ứng tuyển",
            description: "Không có đơn ứng tuyển nào khớp với bộ lọc hiện tại.",
          };
      }
    }

    return {
      title: "Chưa có đơn ứng tuyển nào",
      description:
        "Bạn chưa ứng tuyển vào vị trí nào. Hãy bắt đầu tìm kiếm công việc phù hợp với bạn.",
    };
  };

  const { title, description } = getEmptyMessage();

  return (
    <div className="text-center py-12">
      <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
        <FileText className="h-6 w-6 text-gray-400" />
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>

      <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>

      {!statusFilter && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/jobs">
              <Search className="h-4 w-4 mr-2" />
              Tìm kiếm việc làm
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
