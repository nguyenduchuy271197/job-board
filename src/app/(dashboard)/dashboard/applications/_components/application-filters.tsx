"use client";

import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APPLICATION_STATUSES } from "@/constants/labels";
import type { ApplicationStatus } from "@/types/custom.types";

interface ApplicationFiltersProps {
  statusFilter?: ApplicationStatus;
  onStatusChange: (status: ApplicationStatus | undefined) => void;
}

export default function ApplicationFilters({
  statusFilter,
  onStatusChange,
}: ApplicationFiltersProps) {
  const statusOptions = [
    { value: undefined, label: "Tất cả trạng thái" },
    ...Object.entries(APPLICATION_STATUSES).map(([key, label]) => ({
      value: key as ApplicationStatus,
      label,
    })),
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">Lọc theo:</div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {statusFilter
                ? APPLICATION_STATUSES[statusFilter]
                : "Tất cả trạng thái"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {statusOptions.map((option) => (
              <DropdownMenuItem
                key={option.value || "all"}
                onClick={() => onStatusChange(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
