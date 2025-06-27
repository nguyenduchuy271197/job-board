"use client";

import { Loading } from "@/components/shared/loading";
import { useUserCVs } from "@/hooks/cvs";
import { CVCard } from "./cv-card";

export function CVManagement() {
  const { data: cvs, isLoading, error } = useUserCVs();

  if (isLoading) {
    return <Loading variant="card" text="Đang tải danh sách CV..." />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Có lỗi xảy ra khi tải danh sách CV</p>
      </div>
    );
  }

  if (!cvs || cvs.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
        <div className="mx-auto max-w-sm">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m-16-4c1.381 0 2.721-.087 4-.252"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            Chưa có CV nào
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Hãy tải lên CV đầu tiên của bạn để bắt đầu ứng tuyển.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cvs.map((cv) => (
        <CVCard key={cv.id} cv={cv} />
      ))}
    </div>
  );
}
