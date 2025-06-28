import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { CandidateDashboard } from "./_components/candidate-dashboard";
import { EmployerDashboard } from "./_components/employer-dashboard";
import { AdminDashboard } from "./_components/admin-dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard | JobBoard",
  description: "Quản lý hoạt động tuyển dụng và tìm việc của bạn.",
};

export default async function DashboardPage() {
  const user = await requireAuth();

  // Render dashboard based on user role
  switch (user.role) {
    case "candidate":
      return <CandidateDashboard user={user} />;
    case "employer":
      return <EmployerDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      // Fallback for any edge cases
      return <CandidateDashboard user={user} />;
  }
}
