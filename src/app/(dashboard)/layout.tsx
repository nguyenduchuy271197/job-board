import { ReactNode } from "react";
import { requireAuth } from "@/lib/auth";
import { DashboardSidebar } from "./_components/dashboard-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  // Require authentication
  const user = await requireAuth();

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50">
        <DashboardSidebar user={user} />

        <SidebarInset className="flex-1">
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6 max-w-7xl">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
