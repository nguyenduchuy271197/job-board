"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User as UserIcon,
  Briefcase,
  FileText,
  Heart,
  MessageSquare,
  Settings,
  Building,
  Users,
  Menu,
  LogOut,
  Upload,
  Award,
  Database,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { useLogout } from "@/hooks/auth";
import { getUserRoleLabel } from "@/constants/labels";
import type { User } from "@/types/custom.types";

interface DashboardSidebarProps {
  user: User;
}

const candidateNavItems = [
  { href: "/dashboard", label: "Tổng quan", icon: Home },
  { href: "/dashboard/profile", label: "Hồ sơ cá nhân", icon: UserIcon },
  { href: "/dashboard/cv", label: "Quản lý CV", icon: Upload },
  { href: "/dashboard/skills", label: "Kỹ năng", icon: Award },
  { href: "/dashboard/jobs", label: "Tìm việc làm", icon: Briefcase },
  { href: "/dashboard/applications", label: "Đơn ứng tuyển", icon: FileText },
  { href: "/dashboard/saved-jobs", label: "Việc làm đã lưu", icon: Heart },
  { href: "/dashboard/messages", label: "Tin nhắn", icon: MessageSquare },
];

const employerNavItems = [
  { href: "/dashboard", label: "Tổng quan", icon: Home },
  { href: "/dashboard/profile", label: "Hồ sơ cá nhân", icon: UserIcon },
  { href: "/dashboard/company", label: "Công ty", icon: Building },
  { href: "/dashboard/jobs", label: "Quản lý việc làm", icon: Briefcase },
  { href: "/dashboard/candidates", label: "Ứng viên", icon: Users },
  { href: "/dashboard/messages", label: "Tin nhắn", icon: MessageSquare },
];

const adminNavItems = [
  { href: "/dashboard/admin", label: "Tổng quan", icon: Home },
  { href: "/dashboard/admin/users", label: "Quản lý người dùng", icon: Users },
  {
    href: "/dashboard/admin/companies",
    label: "Quản lý công ty",
    icon: Building,
  },
  { href: "/dashboard/admin/jobs", label: "Quản lý việc làm", icon: Briefcase },
  {
    href: "/dashboard/admin/master-data",
    label: "Quản lý danh mục",
    icon: Database,
  },
];

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const logoutMutation = useLogout();

  const getNavItems = () => {
    switch (user.role) {
      case "admin":
        return adminNavItems;
      case "employer":
        return employerNavItems;
      default:
        return candidateNavItems;
    }
  };

  const navItems = getNavItems();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r">
      {/* User Info */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={user.avatar_url || undefined} />
            <AvatarFallback>
              {user.full_name
                ?.split(" ")
                .map((n) => n[0])
                .join("") || user.email[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {user.full_name || "Chưa cập nhật"}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {getUserRoleLabel(user.role)}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="space-y-2">
          <Link
            href="/dashboard/settings"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <Settings className="h-5 w-5" />
            <span>Cài đặt</span>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="w-full justify-start text-slate-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5 mr-3" />
            {logoutMutation.isPending ? "Đang đăng xuất..." : "Đăng xuất"}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden fixed top-4 left-4 z-40"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
