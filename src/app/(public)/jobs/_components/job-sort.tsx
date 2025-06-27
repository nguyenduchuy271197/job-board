"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sortOptions = [
  { value: "created_at_desc", label: "Mới nhất" },
  { value: "created_at_asc", label: "Cũ nhất" },
  { value: "title_asc", label: "Tên A-Z" },
  { value: "title_desc", label: "Tên Z-A" },
  { value: "salary_desc", label: "Lương cao nhất" },
  { value: "salary_asc", label: "Lương thấp nhất" },
];

export function JobSort() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentSort = searchParams.get("sort_by") || "created_at";
  const currentOrder = searchParams.get("sort_order") || "desc";
  const currentValue = `${currentSort}_${currentOrder}`;

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("_");
    const params = new URLSearchParams(searchParams);

    params.set("sort_by", sortBy);
    params.set("sort_order", sortOrder);

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      <Select value={currentValue} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Sắp xếp theo" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
