import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "./_components/register-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Đăng ký | JobBoard",
  description:
    "Tạo tài khoản JobBoard để tìm việc làm hoặc tuyển dụng nhân tài.",
  robots: "noindex,nofollow",
};

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Tạo tài khoản</h1>
        <p className="mt-2 text-gray-600">
          Bắt đầu hành trình nghề nghiệp của bạn
        </p>
      </div>

      <RegisterForm />

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link
            href="/dang-nhap"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Bằng việc đăng ký, bạn đồng ý với{" "}
          <Link href="/dieu-khoan" className="text-blue-600 hover:underline">
            Điều khoản sử dụng
          </Link>{" "}
          và{" "}
          <Link href="/bao-mat" className="text-blue-600 hover:underline">
            Chính sách bảo mật
          </Link>{" "}
          của chúng tôi.
        </p>
      </div>
    </div>
  );
}
