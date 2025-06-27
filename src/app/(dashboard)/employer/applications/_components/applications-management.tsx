"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Eye,
  MessageCircle,
  Calendar,
  User,
  Briefcase,
  MapPin,
} from "lucide-react";
import { useJobApplications } from "@/hooks/applications";
import { useCompanyJobs } from "@/hooks/jobs";
import { useUpdateApplicationStatus } from "@/hooks/applications";
import { Loading } from "@/components/shared/loading";
import {
  APPLICATION_STATUSES,
  getApplicationStatusLabel,
  getRelativeTime,
  UI,
} from "@/constants/labels";
import type { ApplicationStatus } from "@/types/custom.types";
import { ApplicationDetailsDialog } from "./application-details-dialog";
import { toast } from "sonner";

interface Filters {
  search: string;
  status: ApplicationStatus | "all";
  job_id: string | "all";
}

export function ApplicationsManagement() {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "all",
    job_id: "all",
  });

  // const [selectedApplication, setSelectedApplication] = useState<string | null>(
  //   null
  // );
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

  // Get company jobs for filter
  const { data: jobsData } = useCompanyJobs({
    company_id: currentUserCompany || "",
    page: 1,
    limit: 100,
  });

  // Get applications based on selected job
  const { data: applicationsData, isLoading } = useJobApplications(
    {
      job_id: filters.job_id !== "all" ? filters.job_id : "",
      page: 1,
      limit: 50,
      ...(filters.status !== "all" && { status: filters.status }),
    },
    { enabled: filters.job_id !== "all" }
  );

  const updateStatusMutation = useUpdateApplicationStatus();

  const handleStatusUpdate = async (
    applicationId: string,
    newStatus: ApplicationStatus
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        application_id: applicationId,
        status: newStatus,
      });

      toast.success("Cập nhật trạng thái thành công");
    } catch {
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const getStatusVariant = (status: ApplicationStatus) => {
    switch (status) {
      case "submitted":
        return "secondary";
      case "reviewing":
        return "outline";
      case "interview":
        return "default";
      case "offer":
        return "default";
      case "rejected":
        return "destructive";
      case "withdrawn":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const filteredApplications = applicationsData?.applications
    ? applicationsData.applications.filter((application) => {
        const matchesSearch =
          !filters.search ||
          application.users.full_name
            ?.toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          application.users.email
            .toLowerCase()
            .includes(filters.search.toLowerCase());

        return matchesSearch;
      })
    : [];

  const companyJobs = jobsData?.success ? jobsData.data : [];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Lọc và tìm kiếm ứng viên
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên hoặc email ứng viên..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="pl-10"
              />
            </div>

            <Select
              value={filters.job_id}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, job_id: value }))
              }
            >
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Chọn việc làm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả việc làm</SelectItem>
                {companyJobs?.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  status: value as ApplicationStatus | "all",
                }))
              }
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {Object.entries(APPLICATION_STATUSES).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      {filters.job_id === "all" && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Chọn việc làm để xem ứng viên
              </h3>
              <p className="text-muted-foreground">
                Vui lòng chọn một việc làm cụ thể để xem danh sách ứng viên
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Applications List */}
      {filters.job_id !== "all" && (
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Chưa có ứng viên nào
                  </h3>
                  <p className="text-muted-foreground">
                    Chưa có ứng viên nào ứng tuyển vào vị trí này.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((application) => (
              <Card
                key={application.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">
                              {application.users.full_name || "Chưa có tên"}
                            </h3>
                            <Badge
                              variant={getStatusVariant(application.status)}
                            >
                              {getApplicationStatusLabel(application.status)}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-2">
                            {application.users.email}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Ứng tuyển{" "}
                              {getRelativeTime(application.applied_at)}
                            </div>

                            {application.users.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {application.users.location}
                              </div>
                            )}
                          </div>

                          {application.cover_letter && (
                            <div className="mt-2">
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {application.cover_letter}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status Update */}
                      <Select
                        value={application.status}
                        onValueChange={(value) =>
                          handleStatusUpdate(
                            application.id,
                            value as ApplicationStatus
                          )
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(APPLICATION_STATUSES).map(
                            ([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>

                      {/* View Details */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            {UI.view}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <ApplicationDetailsDialog
                            applicationId={application.id}
                          />
                        </DialogContent>
                      </Dialog>

                      {/* Send Message */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // TODO: Implement messaging functionality
                          console.log("Send message to:", application.id);
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Nhắn tin
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
