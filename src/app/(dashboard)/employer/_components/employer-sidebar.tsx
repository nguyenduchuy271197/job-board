"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Briefcase,
  Users,
  Search,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Tổng quan",
    href: "/employer",
    icon: BarChart3,
    current: false,
  },
  {
    name: "Thông tin công ty",
    href: "/employer/company",
    icon: Building2,
    current: false,
  },
  {
    name: "Quản lý việc làm",
    href: "/employer/jobs",
    icon: Briefcase,
    current: false,
  },
  {
    name: "Quản lý ứng viên",
    href: "/employer/applications",
    icon: Users,
    current: false,
  },
  {
    name: "Tìm kiếm ứng viên",
    href: "/employer/candidates",
    icon: Search,
    current: false,
  },
  {
    name: "Tin nhắn",
    href: "/employer/messages",
    icon: MessageSquare,
    current: false,
  },
  {
    name: "Cài đặt",
    href: "/employer/settings",
    icon: Settings,
    current: false,
  },
];

export function EmployerSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Nhà tuyển dụng
          </h2>
        </div>
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/employer" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5",
                      isActive
                        ? "text-primary-foreground"
                        : "text-gray-400 group-hover:text-gray-500"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
