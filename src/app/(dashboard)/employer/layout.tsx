import { requireEmployer } from "@/lib/auth";
import { DashboardHeader } from "../_components/dashboard-header";
import { EmployerSidebar } from "./_components/employer-sidebar";

export default async function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Require employer authentication - this returns the user
  const user = await requireEmployer();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />
      <div className="flex h-[calc(100vh-3.5rem)]">
        <EmployerSidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
