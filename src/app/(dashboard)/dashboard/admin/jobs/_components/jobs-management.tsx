"use client";

import { useState } from "react";
import { Search, Filter, MoreHorizontal, Eye, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Loading } from "@/components/shared/loading";
import { useJobs, useApproveJob, useHideJob } from "@/hooks/admin/jobs";
import { JobDetailsDialog } from "./job-details-dialog";
import { getJobStatusLabel, getRelativeTime } from "@/constants/labels";
import { toast } from "sonner";
import type { JobWithCompanyAndSkills } from "@/types/custom.types";

type FilterStatus =
  | "all"
  | "draft"
  | "published"
  | "paused"
  | "closed"
  | "expired";

export function JobsManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [page, setPage] = useState(1);
  const [selectedJob, setSelectedJob] =
    useState<JobWithCompanyAndSkills | null>(null);
  const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "hide" | null>(null);
  const [targetJob, setTargetJob] = useState<JobWithCompanyAndSkills | null>(
    null
  );

  const jobsQuery = useJobs({
    page,
    limit: 10,
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const approveJobMutation = useApproveJob();
  const hideJobMutation = useHideJob();

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilter = (status: FilterStatus) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleViewJob = (job: JobWithCompanyAndSkills) => {
    setSelectedJob(job);
    setIsJobDetailsOpen(true);
  };

  const handleApproveJob = (job: JobWithCompanyAndSkills) => {
    setTargetJob(job);
    setActionType("approve");
    setIsConfirmDialogOpen(true);
  };

  const handleHideJob = (job: JobWithCompanyAndSkills) => {
    setTargetJob(job);
    setActionType("hide");
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!targetJob || !actionType) return;

    try {
      if (actionType === "approve") {
        await approveJobMutation.mutateAsync({ job_id: targetJob.id });
        toast.success("Đã duyệt tin tuyển dụng thành công");
      } else if (actionType === "hide") {
        await hideJobMutation.mutateAsync({ job_id: targetJob.id });
        toast.success("Đã ẩn tin tuyển dụng thành công");
      }

      setIsConfirmDialogOpen(false);
      setTargetJob(null);
      setActionType(null);
      jobsQuery.refetch();
    } catch {
      toast.error(
        actionType === "approve"
          ? "Có lỗi xảy ra khi duyệt tin tuyển dụng"
          : "Có lỗi xảy ra khi ẩn tin tuyển dụng"
      );
    }
  };

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

  const jobs =
    jobsQuery.data?.success && jobsQuery.data.data
      ? jobsQuery.data.data.jobs
      : [];
  const pagination =
    jobsQuery.data?.success && jobsQuery.data.data ? jobsQuery.data.data : null;

  if (jobsQuery.isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Card className="p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tiêu đề, công ty..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="published">Đã đăng</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
                <SelectItem value="paused">Tạm dừng</SelectItem>
                <SelectItem value="closed">Đã đóng</SelectItem>
                <SelectItem value="expired">Hết hạn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề công việc</TableHead>
                <TableHead>Công ty</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày đăng</TableHead>
                <TableHead>Ứng tuyển</TableHead>
                <TableHead className="w-[100px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Không tìm thấy tin tuyển dụng nào
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {job.location || "Không xác định"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">
                          {job.companies.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(job.status)}>
                        {getJobStatusLabel(job.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {job.published_at
                          ? getRelativeTime(job.published_at)
                          : getRelativeTime(job.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {job.application_count} ứng tuyển
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewJob(job)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>

                          {job.status === "draft" && (
                            <DropdownMenuItem
                              onClick={() => handleApproveJob(job)}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Duyệt đăng
                            </DropdownMenuItem>
                          )}

                          {(job.status === "published" ||
                            job.status === "paused") && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleHideJob(job)}
                                className="text-red-600"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Ẩn tin đăng
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination && pagination.total > pagination.limit && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Hiển thị {(pagination.page - 1) * pagination.limit + 1} -{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              trong {pagination.total} tin tuyển dụng
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={!pagination.has_previous}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={!pagination.has_next}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Job Details Dialog */}
      {selectedJob && (
        <JobDetailsDialog
          job={selectedJob}
          isOpen={isJobDetailsOpen}
          onClose={() => {
            setIsJobDetailsOpen(false);
            setSelectedJob(null);
          }}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        title={
          actionType === "approve"
            ? "Xác nhận duyệt tin tuyển dụng"
            : "Xác nhận ẩn tin tuyển dụng"
        }
        description={
          actionType === "approve"
            ? `Bạn có chắc chắn muốn duyệt tin tuyển dụng "${targetJob?.title}"? Tin đăng sẽ được hiển thị công khai.`
            : `Bạn có chắc chắn muốn ẩn tin tuyển dụng "${targetJob?.title}"? Tin đăng sẽ không hiển thị với người dùng.`
        }
        confirmText={actionType === "approve" ? "Duyệt" : "Ẩn"}
        variant={actionType === "hide" ? "destructive" : "default"}
        onConfirm={handleConfirmAction}
        isLoading={approveJobMutation.isPending || hideJobMutation.isPending}
      />
    </>
  );
}
