"use client";

import { SavedJobCard } from "./saved-job-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SavedJobWithDetails } from "@/types/custom.types";

interface SavedJobsListProps {
  savedJobs: SavedJobWithDetails[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    has_next: boolean;
    has_previous: boolean;
  };
  onPageChange: (page: number) => void;
}

export function SavedJobsList({
  savedJobs,
  pagination,
  onPageChange,
}: SavedJobsListProps) {
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const startItem = (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(
    pagination.page * pagination.limit,
    pagination.total
  );

  return (
    <div className="space-y-6">
      {/* Jobs Grid */}
      <div className="grid gap-4">
        {savedJobs.map((savedJob) => (
          <SavedJobCard key={savedJob.id} savedJob={savedJob} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Hiển thị {startItem}-{endItem} trong tổng {pagination.total} việc
            làm
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.has_previous}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Trước
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => {
                const page = i + 1;
                const isCurrentPage = page === pagination.page;

                // Show first page, last page, current page and adjacent pages
                const showPage =
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - pagination.page) <= 1;

                if (!showPage) {
                  // Show ellipsis
                  if (page === 2 && pagination.page > 4) {
                    return (
                      <span key={page} className="px-2 text-muted-foreground">
                        ...
                      </span>
                    );
                  }
                  if (
                    page === totalPages - 1 &&
                    pagination.page < totalPages - 3
                  ) {
                    return (
                      <span key={page} className="px-2 text-muted-foreground">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <Button
                    key={page}
                    variant={isCurrentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    className="w-8 h-8"
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.has_next}
            >
              Sau
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
