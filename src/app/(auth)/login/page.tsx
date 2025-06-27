import { LoginForm } from "./_components/login-form";
import { PAGE_TITLES } from "@/constants/labels";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập | Jobboard",
  description:
    "Đăng nhập vào tài khoản Jobboard để tìm kiếm việc làm hoặc tuyển dụng nhân tài",
  keywords: ["đăng nhập", "login", "job board", "tài khoản"],
  openGraph: {
    title: "Đăng nhập | Jobboard",
    description:
      "Đăng nhập vào tài khoản Jobboard để tìm kiếm việc làm hoặc tuyển dụng nhân tài",
    type: "website",
  },
};

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          {PAGE_TITLES.login}
        </h2>
        <p className="text-slate-600 mt-2">Chào mừng bạn quay trở lại</p>
      </div>

      <LoginForm />
    </div>
  );
}
