"use client";

import { Search, MapPin, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS } from "@/constants/labels";
import type { SavedJobFilterState } from "./saved-jobs-management";

interface SavedJobFiltersProps {
  filters: SavedJobFilterState;
  onFilterChange: (filters: Partial<SavedJobFilterState>) => void;
  onClearFilters: () => void;
  resultsCount: number;
}

export function SavedJobFilters({
  filters,
  onFilterChange,
  onClearFilters,
  resultsCount,
}: SavedJobFiltersProps) {
  const hasActiveFilters =
    filters.search !== "" ||
    filters.location !== "" ||
    filters.employment_type !== "all" ||
    filters.experience_level !== "all" ||
    filters.salary_min !== undefined ||
    filters.salary_max !== undefined;

  return (
    <div className="space-y-4">
      {/* Search and Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
          <Input
            placeholder="Tìm kiếm theo tên việc làm, công ty..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
          <Input
            placeholder="Địa điểm"
            value={filters.location}
            onChange={(e) => onFilterChange({ location: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Lọc:</span>
        </div>

        <Select
          value={filters.employment_type}
          onValueChange={(value) =>
            onFilterChange({
              employment_type: value as SavedJobFilterState["employment_type"],
            })
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Loại hình" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại hình</SelectItem>
            {Object.entries(EMPLOYMENT_TYPES).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.experience_level}
          onValueChange={(value) =>
            onFilterChange({
              experience_level:
                value as SavedJobFilterState["experience_level"],
            })
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Kinh nghiệm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả cấp độ</SelectItem>
            {Object.entries(EXPERIENCE_LEVELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={`${filters.sort_by}-${filters.sort_order}`}
          onValueChange={(value) => {
            const [sort_by, sort_order] = value.split("-") as [
              SavedJobFilterState["sort_by"],
              SavedJobFilterState["sort_order"]
            ];
            onFilterChange({ sort_by, sort_order });
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at-desc">Mới lưu nhất</SelectItem>
            <SelectItem value="created_at-asc">Cũ nhất</SelectItem>
            <SelectItem value="job_title-asc">Tên A-Z</SelectItem>
            <SelectItem value="job_title-desc">Tên Z-A</SelectItem>
            <SelectItem value="company_name-asc">Công ty A-Z</SelectItem>
            <SelectItem value="company_name-desc">Công ty Z-A</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="h-9"
          >
            <X className="h-4 w-4 mr-2" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-normal">
            {resultsCount} việc làm đã lưu
          </Badge>
          {hasActiveFilters && (
            <Badge variant="outline" className="font-normal">
              Đã lọc
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
