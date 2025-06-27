import { PageHeader } from "@/components/shared/page-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tổng quan | Jobboard",
  description:
    "Bảng điều khiển tổng quan - Theo dõi hoạt động tìm việc, đơn ứng tuyển và các cơ hội nghề nghiệp mới.",
  keywords: [
    "dashboard",
    "tổng quan",
    "bảng điều khiển",
    "hoạt động",
    "việc làm",
  ],
  openGraph: {
    title: "Tổng quan | Jobboard",
    description:
      "Bảng điều khiển tổng quan - Theo dõi hoạt động tìm việc, đơn ứng tuyển và các cơ hội nghề nghiệp mới.",
    type: "website",
  },
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tổng quan"
        description="Chào mừng bạn đến với bảng điều khiển"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-slate-900">Việc làm mới</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
          <p className="text-sm text-slate-600 mt-1">
            Việc làm phù hợp với bạn
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-slate-900">
            Đơn ứng tuyển
          </h3>
          <p className="text-3xl font-bold text-green-600 mt-2">8</p>
          <p className="text-sm text-slate-600 mt-1">Đơn đã nộp trong tháng</p>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-slate-900">Hồ sơ xem</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">24</p>
          <p className="text-sm text-slate-600 mt-1">Lượt xem hồ sơ tuần này</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Hoạt động gần đây
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-slate-600">
                Bạn đã ứng tuyển vào vị trí Frontend Developer
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-slate-600">
                Hồ sơ của bạn đã được xem bởi ABC Company
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <p className="text-sm text-slate-600">
                Bạn đã lưu 3 việc làm mới
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Việc làm đề xuất
          </h3>
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-3">
              <p className="font-medium text-slate-900">
                Senior React Developer
              </p>
              <p className="text-sm text-slate-600">TechViet Company</p>
            </div>
            <div className="border-l-4 border-green-500 pl-3">
              <p className="font-medium text-slate-900">Full Stack Developer</p>
              <p className="text-sm text-slate-600">StartupXYZ</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-3">
              <p className="font-medium text-slate-900">UI/UX Designer</p>
              <p className="text-sm text-slate-600">Design Studio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
