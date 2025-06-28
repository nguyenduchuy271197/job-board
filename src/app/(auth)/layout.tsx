import { ReactNode } from "react";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

interface AuthLayoutProps {
  children: ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const user = await requireAuth();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white">
        <div className="flex flex-col justify-center max-w-md mx-auto">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <Briefcase className="h-8 w-8" />
            <span className="text-2xl font-bold">JobBoard</span>
          </Link>

          <h1 className="text-4xl font-bold mb-4">
            Kết nối tài năng với cơ hội
          </h1>

          <p className="text-lg text-blue-100 mb-8">
            Nền tảng tuyển dụng hàng đầu Việt Nam. Tìm việc làm mơ ước hoặc
            tuyển dụng nhân tài phù hợp chỉ trong vài cú click.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-300 rounded-full" />
              <span className="text-blue-100">
                Hơn 10,000 việc làm chất lượng
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-300 rounded-full" />
              <span className="text-blue-100">1,000+ công ty uy tín</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-300 rounded-full" />
              <span className="text-blue-100">Công cụ tìm kiếm thông minh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-600"
            >
              <Briefcase className="h-8 w-8" />
              <span className="text-2xl font-bold">JobBoard</span>
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
