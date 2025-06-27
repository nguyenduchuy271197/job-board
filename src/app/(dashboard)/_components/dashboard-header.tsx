import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/custom.types";

interface DashboardHeaderProps {
  user: User;
}

export function DashboardHeader({}: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-6 lg:px-8">
      <div className="flex-1" />

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>
      </div>
    </header>
  );
}
