"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  Eye,
  UserX,
  UserCheck,
  MoreHorizontal,
  Users,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useUsers } from "@/hooks/admin/users";
import { useDeactivateUser } from "@/hooks/admin/users";
import { Loading } from "@/components/shared/loading";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { UserDetailsDialog } from "./user-details-dialog";
import { getUserRoleLabel, getRelativeTime } from "@/constants/labels";
import { toast } from "sonner";
import type { User } from "@/types/custom.types";

export function UsersManagement() {
  const [filters, setFilters] = useState({
    search: "",
    role: "all" as "all" | "candidate" | "employer" | "admin",
    is_active: "all" as "all" | "true" | "false",
    page: 1,
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // Fetch users data
  const { data: usersData, isLoading } = useUsers({
    page: filters.page,
    limit: 20,
    search: filters.search || undefined,
    role: filters.role !== "all" ? filters.role : undefined,
    is_active:
      filters.is_active !== "all" ? filters.is_active === "true" : undefined,
  });

  // Deactivate user mutation
  const deactivateUserMutation = useDeactivateUser();

  const users =
    usersData?.success && usersData.data ? usersData.data.users : [];
  const pagination =
    usersData?.success && usersData.data ? usersData.data : null;

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleRoleChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      role: value as typeof filters.role,
      page: 1,
    }));
  };

  const handleActiveChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      is_active: value as typeof filters.is_active,
      page: 1,
    }));
  };

  const handleUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsUserDetailsOpen(true);
  };

  const handleDeactivateClick = (user: User) => {
    setUserToDeactivate(user);
    setIsConfirmDialogOpen(true);
  };

  const handleDeactivateConfirm = async () => {
    if (!userToDeactivate) return;

    try {
      const result = await deactivateUserMutation.mutateAsync({
        user_id: userToDeactivate.id,
      });

      if (result.success) {
        toast.success("Đã vô hiệu hóa tài khoản người dùng");
        setIsConfirmDialogOpen(false);
        setUserToDeactivate(null);
      } else {
        toast.error(result.error || "Vô hiệu hóa tài khoản thất bại");
      }
    } catch (error) {
      toast.error("Vô hiệu hóa tài khoản thất bại");
      console.error("Deactivate user error:", error);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive" as const;
      case "employer":
        return "default" as const;
      case "candidate":
        return "secondary" as const;
      default:
        return "outline" as const;
    }
  };

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
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên hoặc email..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={filters.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                <SelectItem value="candidate">Ứng viên</SelectItem>
                <SelectItem value="employer">Nhà tuyển dụng</SelectItem>
                <SelectItem value="admin">Quản trị viên</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.is_active}
              onValueChange={handleActiveChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="true">Đang hoạt động</SelectItem>
                <SelectItem value="false">Đã vô hiệu hóa</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {pagination?.total || 0} người dùng
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Không tìm thấy người dùng nào
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback>
                            {user.full_name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("") || user.email[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {user.full_name || "Chưa cập nhật"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {getUserRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.is_active ? (
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <UserCheck className="h-3 w-3" />
                            Hoạt động
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <UserX className="h-3 w-3" />
                            Vô hiệu hóa
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {getRelativeTime(user.created_at)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleUserDetails(user)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          {user.is_active && user.role !== "admin" && (
                            <DropdownMenuItem
                              onClick={() => handleDeactivateClick(user)}
                              className="text-red-600"
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              Vô hiệu hóa
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị {(pagination.page - 1) * pagination.limit + 1} đến{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
            trong số {pagination.total} người dùng
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={!pagination.has_previous}
            >
              Trang trước
            </Button>
            <span className="text-sm">Trang {pagination.page}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={!pagination.has_next}
            >
              Trang sau
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      {selectedUser && (
        <UserDetailsDialog
          user={selectedUser}
          open={isUserDetailsOpen}
          onOpenChange={setIsUserDetailsOpen}
        />
      )}

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        title="Xác nhận vô hiệu hóa tài khoản"
        description={`Bạn có chắc chắn muốn vô hiệu hóa tài khoản của ${
          userToDeactivate?.full_name || userToDeactivate?.email
        }? Người dùng sẽ không thể đăng nhập vào hệ thống.`}
        confirmText="Vô hiệu hóa"
        variant="destructive"
        onConfirm={handleDeactivateConfirm}
        isLoading={deactivateUserMutation.isPending}
      />
    </div>
  );
}
