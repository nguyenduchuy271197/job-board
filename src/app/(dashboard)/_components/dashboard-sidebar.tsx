"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Briefcase,
  Building2,
  FileText,
  BookmarkCheck,
  MessageSquare,
  Settings,
  LogOut,
  Shield,
  Users,
  BarChart3,
  Database,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/auth";
import { toast } from "sonner";
import { User as UserType } from "@/types/custom.types";

interface DashboardSidebarProps {
  user: UserType;
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Đăng xuất thành công!");
    } catch {
      toast.error("Đăng xuất thất bại");
    }
  };

  // Get navigation items based on user role
  const getNavigationItems = () => {
    const commonItems = [
      {
        title: "Hồ sơ cá nhân",
        url: "/dashboard/ho-so",
        icon: User,
      },
    ];

    if (user.role === "candidate") {
      return [
        ...commonItems,
        {
          title: "Tìm việc làm",
          url: "/dashboard/viec-lam",
          icon: Briefcase,
        },
        {
          title: "Đơn ứng tuyển",
          url: "/dashboard/ung-tuyen",
          icon: FileText,
        },
        {
          title: "Việc làm đã lưu",
          url: "/dashboard/da-luu",
          icon: BookmarkCheck,
        },
        {
          title: "Tin nhắn",
          url: "/dashboard/tin-nhan",
          icon: MessageSquare,
        },
      ];
    }

    if (user.role === "employer") {
      return [
        ...commonItems,
        {
          title: "Thông tin công ty",
          url: "/dashboard/cong-ty",
          icon: Building2,
        },
        {
          title: "Quản lý tin tuyển dụng",
          url: "/dashboard/tin-tuyen-dung",
          icon: Briefcase,
        },
        {
          title: "Ứng viên",
          url: "/dashboard/ung-vien",
          icon: Users,
        },
        {
          title: "Tìm ứng viên",
          url: "/dashboard/tim-ung-vien",
          icon: Users,
        },
        {
          title: "Tin nhắn",
          url: "/dashboard/tin-nhan",
          icon: MessageSquare,
        },
      ];
    }

    if (user.role === "admin") {
      return [
        ...commonItems,
        {
          title: "Thống kê tổng quan",
          url: "/admin/dashboard",
          icon: BarChart3,
        },
        {
          title: "Quản lý người dùng",
          url: "/admin/nguoi-dung",
          icon: Users,
        },
        {
          title: "Quản lý công ty",
          url: "/admin/cong-ty",
          icon: Building2,
        },
        {
          title: "Quản lý việc làm",
          url: "/admin/viec-lam",
          icon: Briefcase,
        },
        {
          title: "Dữ liệu chính",
          url: "/admin/du-lieu-chinh",
          icon: Database,
        },
      ];
    }

    return commonItems;
  };

  const navigationItems = getNavigationItems();

  const getUserDisplayName = () => {
    return user.full_name || user.email.split("@")[0];
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDisplayName = () => {
    switch (user.role) {
      case "candidate":
        return "Ứng viên";
      case "employer":
        return "Nhà tuyển dụng";
      case "admin":
        return "Quản trị viên";
      default:
        return "Người dùng";
    }
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Briefcase className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold">JobBoard</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Điều hướng</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Cài đặt</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/cai-dat"}
                >
                  <Link href="/dashboard/cai-dat">
                    <Settings className="h-4 w-4" />
                    <span>Cài đặt</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url || undefined} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {getUserDisplayName()}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {getRoleDisplayName()}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="end" side="top">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/ho-so">
                    <User className="mr-2 h-4 w-4" />
                    Hồ sơ cá nhân
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/dashboard/cai-dat">
                    <Settings className="mr-2 h-4 w-4" />
                    Cài đặt
                  </Link>
                </DropdownMenuItem>

                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Shield className="mr-2 h-4 w-4" />
                      Quản trị hệ thống
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {logoutMutation.isPending ? "Đang đăng xuất..." : "Đăng xuất"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
