import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trang chủ | Jobboard",
  description:
    "Nền tảng tuyển dụng hàng đầu Việt Nam. Kết nối nhà tuyển dụng và ứng viên một cách hiệu quả.",
  keywords: [
    "việc làm",
    "tuyển dụng",
    "job board",
    "việt nam",
    "ứng viên",
    "nhà tuyển dụng",
  ],
  openGraph: {
    title: "Trang chủ | Jobboard",
    description:
      "Nền tảng tuyển dụng hàng đầu Việt Nam. Kết nối nhà tuyển dụng và ứng viên một cách hiệu quả.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Job Board</h1>
          <p className="text-lg text-slate-600">
            Nền tảng tuyển dụng hàng đầu Việt Nam
          </p>
          <p className="text-slate-500 mt-2">
            Kết nối nhà tuyển dụng và ứng viên một cách hiệu quả
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/dang-ky">Đăng ký ngay</Link>
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link href="/dang-nhap">Đăng nhập</Link>
          </Button>
        </div>

        <div className="text-sm text-slate-500">
          <p>
            Tìm kiếm cơ hội nghề nghiệp mới hoặc tuyển dụng nhân tài cho doanh
            nghiệp của bạn
          </p>
        </div>
      </div>
    </div>
  );
}
