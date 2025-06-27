"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  MapPin,
} from "lucide-react";
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
import { useLocations } from "@/hooks/admin/master-data";
import { getRelativeTime } from "@/constants/labels";
import type { Location } from "@/types/custom.types";

export function LocationsTab() {
  const [search, setSearch] = useState("");

  const locationsQuery = useLocations();

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleCreateLocation = () => {
    // TODO: Open create dialog
    console.log("Create location");
  };

  const handleEditLocation = (location: Location) => {
    // TODO: Open edit dialog
    console.log("Edit location", location);
  };

  const handleDeleteLocation = (location: Location) => {
    // TODO: Show confirm dialog then delete
    console.log("Delete location", location);
  };

  if (locationsQuery.isLoading) {
    return <Loading />;
  }

  const locations =
    locationsQuery.data?.success && locationsQuery.data.data
      ? locationsQuery.data.data
      : [];

  // Filter locations based on search
  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(search.toLowerCase()) ||
      location.slug.toLowerCase().includes(search.toLowerCase()) ||
      (location.province &&
        location.province.toLowerCase().includes(search.toLowerCase())) ||
      location.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm địa điểm..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button onClick={handleCreateLocation}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm địa điểm
        </Button>
      </div>

      {/* Locations Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên địa điểm</TableHead>
              <TableHead>Tỉnh/Thành phố</TableHead>
              <TableHead>Quốc gia</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="w-[100px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLocations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  {search
                    ? "Không tìm thấy địa điểm nào"
                    : "Chưa có địa điểm nào"}
                </TableCell>
              </TableRow>
            ) : (
              filteredLocations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div className="font-medium">{location.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{location.province || "—"}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{location.country}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground font-mono">
                      {location.slug}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {getRelativeTime(location.created_at)}
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
                          onClick={() => handleEditLocation(location)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteLocation(location)}
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
        Hiển thị {filteredLocations.length} trong {locations.length} địa điểm
      </div>
    </Card>
  );
}
