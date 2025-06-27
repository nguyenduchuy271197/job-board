"use client";

import { useState } from "react";
import { useUserApplications } from "@/hooks/applications";
import { Loading } from "@/components/shared/loading";
import ApplicationCard from "./application-card";
import ApplicationFilters from "./application-filters";
import EmptyApplications from "./empty-applications";
import type { ApplicationStatus } from "@/types/custom.types";

export default function ApplicationsManagement() {
  const [statusFilter, setStatusFilter] = useState<
    ApplicationStatus | undefined
  >();

  const {
    data: applications,
    isLoading,
    error,
  } = useUserApplications({
    status: statusFilter,
  });

  if (isLoading) {
    return <Loading text="Đang tải đơn ứng tuyển..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-2">Lỗi khi tải đơn ứng tuyển</div>
        <div className="text-gray-500 text-sm">{error.message}</div>
      </div>
    );
  }

  const applicationsList = applications?.applications || [];
  const hasApplications = applicationsList.length > 0;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <ApplicationFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Applications List */}
      {hasApplications ? (
        <div className="space-y-4">
          {applicationsList.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      ) : (
        <EmptyApplications statusFilter={statusFilter} />
      )}
    </div>
  );
}
