"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Users,
  Calendar,
  MapPin,
  Briefcase,
} from "lucide-react";
import { useCompanyJobs } from "@/hooks/jobs";
import { useDeleteJob } from "@/hooks/jobs";
import { Loading } from "@/components/shared/loading";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  JOB_STATUSES,
  getJobStatusLabel,
  getEmploymentTypeLabel,
  getExperienceLevelLabel,
  formatSalary,
  getRelativeTime,
} from "@/constants/labels";
import type { JobStatus } from "@/types/custom.types";
import Link from "next/link";

export function JobsManagement() {
  const [filters, setFilters] = useState({
    search: "",
    status: "all" as JobStatus | "all",
    sort_by: "created_at" as
      | "created_at"
      | "published_at"
      | "application_count",
    sort_order: "desc" as const,
  });

  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);
  const [currentUserCompany, setCurrentUserCompany] = useState<string | null>(
    null
  );

  // Get current user's company
  useEffect(() => {
    async function getUserCompany() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data: companyMember } = await supabase
          .from("company_members")
          .select("company_id")
          .eq("user_id", user.id)
          .single();

        if (companyMember) {
          setCurrentUserCompany(companyMember.company_id);
        }
      } catch (error) {
        console.error("Error getting user company:", error);
      }
    }

    getUserCompany();
  }, []);

  const {
    data: jobsData,
    isLoading,
    error,
  } = useCompanyJobs({
    company_id: currentUserCompany || "",
    page: 1,
    limit: 20,
    ...(filters.status !== "all" && { status: filters.status }),
  });

  const deleteJobMutation = useDeleteJob();

  const handleDeleteJob = async () => {
    if (!deleteJobId) return;

    await deleteJobMutation.mutateAsync({ id: deleteJobId });
    setDeleteJobId(null);
  };

  const getStatusVariant = (status: JobStatus) => {
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
        return "secondary";
    }
  };

  const filteredJobs =
    jobsData?.success && jobsData.data
      ? jobsData.data.filter((job) => {
          const matchesSearch =
            !filters.search ||
            job.title.toLowerCase().includes(filters.search.toLowerCase());
          const matchesStatus =
            filters.status === "all" || job.status === filters.status;

          return matchesSearch && matchesStatus;
        })
      : [];

  if (isLoading) {
    return <Loading />;
  }

  if (error || !jobsData?.success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Có lỗi xảy ra khi tải danh sách việc làm. Vui lòng thử lại sau.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Lọc và tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề việc làm..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="pl-10"
              />
            </div>

            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  status: value as JobStatus | "all",
                }))
              }
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {Object.entries(JOB_STATUSES).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.sort_by}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  sort_by: value as
                    | "created_at"
                    | "published_at"
                    | "application_count",
                }))
              }
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Ngày tạo</SelectItem>
                <SelectItem value="published_at">Ngày đăng</SelectItem>
                <SelectItem value="application_count">
                  Số đơn ứng tuyển
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Chưa có việc làm nào
                </h3>
                <p className="text-muted-foreground mb-6">
                  Bắt đầu bằng cách đăng tin tuyển dụng đầu tiên của bạn.
                </p>
                <Button asChild>
                  <Link href="/employer/jobs/create">Đăng tin tuyển dụng</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">
                            <Link
                              href={`/jobs/${job.slug}`}
                              className="hover:text-primary transition-colors"
                            >
                              {job.title}
                            </Link>
                          </h3>
                          <Badge variant={getStatusVariant(job.status)}>
                            {getJobStatusLabel(job.status)}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {getEmploymentTypeLabel(job.employment_type)}
                          </div>

                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {getExperienceLevelLabel(job.experience_level)}
                          </div>

                          {job.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                              {job.is_remote && " (Remote)"}
                            </div>
                          )}

                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {getRelativeTime(job.created_at)}
                          </div>
                        </div>

                        {(job.salary_min || job.salary_max) && (
                          <div className="mb-3">
                            <span className="text-sm font-medium text-green-600">
                              {formatSalary(
                                job.salary_min ?? undefined,
                                job.salary_max ?? undefined,
                                job.currency ?? undefined
                              )}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>
                              {job.application_count || 0} đơn ứng tuyển
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/jobs/${job.slug}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/employer/jobs/${job.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/employer/jobs/${job.id}/applications`}>
                          <Users className="mr-2 h-4 w-4" />
                          Xem đơn ứng tuyển
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteJobId(job.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa việc làm
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteJobId}
        onClose={() => setDeleteJobId(null)}
        title="Xóa việc làm"
        description="Bạn có chắc chắn muốn xóa việc làm này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleDeleteJob}
        isLoading={deleteJobMutation.isPending}
        variant="destructive"
      />
    </div>
  );
}
