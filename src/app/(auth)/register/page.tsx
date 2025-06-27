import { RegisterForm } from "./_components/register-form";
import { PAGE_TITLES } from "@/constants/labels";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký | Jobboard",
  description:
    "Tạo tài khoản Jobboard miễn phí để tìm kiếm việc làm mơ ước hoặc tuyển dụng nhân tài xuất sắc",
  keywords: ["đăng ký", "register", "tạo tài khoản", "job board", "miễn phí"],
  openGraph: {
    title: "Đăng ký | Jobboard",
    description:
      "Tạo tài khoản Jobboard miễn phí để tìm kiếm việc làm mơ ước hoặc tuyển dụng nhân tài xuất sắc",
    type: "website",
  },
};

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          {PAGE_TITLES.register}
        </h2>
        <p className="text-slate-600 mt-2">
          Tạo tài khoản để bắt đầu hành trình nghề nghiệp
        </p>
      </div>

      <RegisterForm />
    </div>
  );
}
