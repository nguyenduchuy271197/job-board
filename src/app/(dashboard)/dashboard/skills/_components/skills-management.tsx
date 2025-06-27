"use client";

import { Loading } from "@/components/shared/loading";
import { useSkills, useUserSkills } from "@/hooks/skills";
import { SkillsSelector } from "./skills-selector";
import { UserSkillsList } from "./user-skills-list";

export function SkillsManagement() {
  const { data: allSkills, isLoading: skillsLoading } = useSkills();
  const { data: userSkills, isLoading: userSkillsLoading } = useUserSkills();

  if (skillsLoading || userSkillsLoading) {
    return <Loading variant="card" text="Đang tải dữ liệu kỹ năng..." />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Kỹ năng của tôi */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Kỹ năng của tôi
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Quản lý kỹ năng và cập nhật mức độ thành thạo
          </p>
        </div>
        <UserSkillsList userSkills={userSkills || []} />
      </div>

      {/* Thêm kỹ năng mới */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Thêm kỹ năng</h2>
          <p className="text-sm text-slate-600 mt-1">
            Tìm kiếm và thêm kỹ năng mới vào hồ sơ của bạn
          </p>
        </div>
        <SkillsSelector
          allSkills={allSkills?.skills || []}
          userSkills={userSkills || []}
        />
      </div>
    </div>
  );
}
