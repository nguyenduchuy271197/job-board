"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Filter, X, MapPin, DollarSign, Clock, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS } from "@/constants/labels";
import type { EmploymentType, ExperienceLevel } from "@/types/custom.types";

interface FilterState {
  query: string;
  location: string;
  employment_type: EmploymentType | "";
  experience_level: ExperienceLevel | "";
  salary_min: string;
  salary_max: string;
  is_remote: boolean;
}

export function JobFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [filters, setFilters] = useState<FilterState>({
    query: searchParams.get("query") || "",
    location: searchParams.get("location") || "",
    employment_type:
      (searchParams.get("employment_type") as EmploymentType) || "",
    experience_level:
      (searchParams.get("experience_level") as ExperienceLevel) || "",
    salary_min: searchParams.get("salary_min") || "",
    salary_max: searchParams.get("salary_max") || "",
    is_remote: searchParams.get("is_remote") === "true",
  });

  const updateFilters = (key: keyof FilterState, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Update URL with new filters
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (
        v !== "" &&
        v !== false &&
        v !== null &&
        v !== undefined &&
        v !== "all"
      ) {
        params.set(k, v.toString());
      }
    });

    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl);
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      location: "",
      employment_type: "",
      experience_level: "",
      salary_min: "",
      salary_max: "",
      is_remote: false,
    });
    router.push(pathname);
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) =>
      value !== "" &&
      value !== false &&
      value !== null &&
      value !== undefined &&
      value !== "all"
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Bộ lọc</span>
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Query */}
        <div className="space-y-2">
          <Label htmlFor="query">Từ khóa</Label>
          <Input
            id="query"
            placeholder="Nhập từ khóa tìm kiếm..."
            value={filters.query}
            onChange={(e) => updateFilters("query", e.target.value)}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>Địa điểm</span>
          </Label>
          <Input
            id="location"
            placeholder="Nhập địa điểm..."
            value={filters.location}
            onChange={(e) => updateFilters("location", e.target.value)}
          />
        </div>

        {/* Employment Type */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>Loại hình công việc</span>
          </Label>
          <Select
            value={filters.employment_type}
            onValueChange={(value) => updateFilters("employment_type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại hình" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {Object.entries(EMPLOYMENT_TYPES).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-1">
            <Building className="h-4 w-4" />
            <span>Mức kinh nghiệm</span>
          </Label>
          <Select
            value={filters.experience_level}
            onValueChange={(value) => updateFilters("experience_level", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn mức kinh nghiệm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {Object.entries(EXPERIENCE_LEVELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Salary Range */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-1">
            <DollarSign className="h-4 w-4" />
            <span>Mức lương (triệu VNĐ)</span>
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Từ"
              value={filters.salary_min}
              onChange={(e) => updateFilters("salary_min", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Đến"
              value={filters.salary_max}
              onChange={(e) => updateFilters("salary_max", e.target.value)}
            />
          </div>
        </div>

        {/* Remote Work */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_remote"
            checked={filters.is_remote}
            onCheckedChange={(checked) =>
              updateFilters("is_remote", checked as boolean)
            }
          />
          <Label htmlFor="is_remote" className="text-sm font-normal">
            Làm việc từ xa
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
