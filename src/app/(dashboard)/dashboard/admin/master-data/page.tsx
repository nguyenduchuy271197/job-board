import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Loading } from "@/components/shared/loading";
import { MasterDataManagement } from "./_components/master-data-management";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý danh mục | Jobboard",
  description:
    "Quản lý dữ liệu chính của hệ thống: ngành nghề, kỹ năng, và địa điểm. Thêm, sửa, xóa các danh mục cốt lõi.",
  keywords: [
    "quản lý danh mục",
    "admin",
    "master data",
    "ngành nghề",
    "kỹ năng",
    "địa điểm",
  ],
  openGraph: {
    title: "Quản lý danh mục | Jobboard",
    description:
      "Quản lý dữ liệu chính của hệ thống: ngành nghề, kỹ năng, và địa điểm. Thêm, sửa, xóa các danh mục cốt lõi.",
    type: "website",
  },
};

export default function AdminMasterDataPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý danh mục"
        description="Thêm, sửa, xóa ngành nghề, kỹ năng và địa điểm"
      />

      <Suspense fallback={<Loading />}>
        <MasterDataManagement />
      </Suspense>
    </div>
  );
}
