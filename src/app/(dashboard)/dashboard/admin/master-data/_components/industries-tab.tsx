"use client";

import { useState } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
import { Loading } from "@/components/shared/loading";
import { useIndustries } from "@/hooks/admin/master-data";
import { getRelativeTime } from "@/constants/labels";
import type { Industry } from "@/types/custom.types";

export function IndustriesTab() {
  const [search, setSearch] = useState("");

  const industriesQuery = useIndustries();

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleCreateIndustry = () => {
    // TODO: Open create dialog
    console.log("Create industry");
  };

  const handleEditIndustry = (industry: Industry) => {
    // TODO: Open edit dialog
    console.log("Edit industry", industry);
  };

  const handleDeleteIndustry = (industry: Industry) => {
    // TODO: Show confirm dialog then delete
    console.log("Delete industry", industry);
  };

  if (industriesQuery.isLoading) {
    return <Loading />;
  }

  const industries =
    industriesQuery.data?.success && industriesQuery.data.data
      ? industriesQuery.data.data
      : [];

  // Filter industries based on search
  const filteredIndustries = industries.filter(
    (industry) =>
      industry.name.toLowerCase().includes(search.toLowerCase()) ||
      industry.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm ngành nghề..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button onClick={handleCreateIndustry}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm ngành nghề
        </Button>
      </div>

      {/* Industries Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên ngành nghề</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="w-[100px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIndustries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  {search
                    ? "Không tìm thấy ngành nghề nào"
                    : "Chưa có ngành nghề nào"}
                </TableCell>
              </TableRow>
            ) : (
              filteredIndustries.map((industry) => (
                <TableRow key={industry.id}>
                  <TableCell>
                    <div className="font-medium">{industry.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground font-mono">
                      {industry.slug}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {getRelativeTime(industry.created_at)}
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
                        <DropdownMenuItem
                          onClick={() => handleEditIndustry(industry)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteIndustry(industry)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Stats */}
      <div className="mt-6 text-sm text-muted-foreground">
        Hiển thị {filteredIndustries.length} trong {industries.length} ngành
        nghề
      </div>
    </Card>
  );
}
