import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./_components/login-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Đăng nhập | JobBoard",
  description:
    "Đăng nhập vào tài khoản JobBoard để tiếp tục tìm việc làm hoặc quản lý tuyển dụng.",
  robots: "noindex,nofollow",
};

interface LoginPageProps {
  params: Promise<{
    message?: string;
    redirectTo?: string;
  }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { redirectTo, message } = await params;
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Đăng nhập</h1>
        <p className="mt-2 text-gray-600">Chào mừng bạn trở lại với JobBoard</p>
      </div>

      {/* Success message from registration */}
      {message === "registration-success" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">
            ✅ Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.
          </p>
        </div>
      )}

      {/* Redirect notice */}
      {redirectTo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            ℹ️ Vui lòng đăng nhập để truy cập trang được yêu cầu.
          </p>
        </div>
      )}

      <LoginForm redirectTo={redirectTo} />

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link
            href="/dang-ky"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>

      <div className="text-center">
        <Link
          href="/quen-mat-khau"
          className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
        >
          Quên mật khẩu?
        </Link>
      </div>
    </div>
  );
}
