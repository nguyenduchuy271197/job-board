import { ReactNode } from "react";
import { getServerUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface AuthLayoutProps {
  children: ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  // Redirect to dashboard if already logged in
  const user = await getServerUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Job Board</h1>
          <p className="text-slate-600 mt-2">
            Nền tảng tuyển dụng hàng đầu Việt Nam
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">{children}</div>
      </div>
    </div>
  );
}
