"use client";

import { useState } from "react";
import { Trash2, Edit3, Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useUpdateUserSkills } from "@/hooks/skills";
import { PROFICIENCY_LEVELS } from "@/constants/labels";
import type { UserSkill, Skill } from "@/types/custom.types";

type UserSkillWithSkill = UserSkill & {
  skills: Skill;
};

interface UserSkillsListProps {
  userSkills: UserSkillWithSkill[];
}

export function UserSkillsList({ userSkills }: UserSkillsListProps) {
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<UserSkillWithSkill | null>(
    null
  );
  const updateUserSkillsMutation = useUpdateUserSkills();

  const handleUpdateLevel = async (skillId: string, newLevel: string) => {
    try {
      const updatedSkills = userSkills.map((skill) =>
        skill.skill_id === skillId
          ? {
              ...skill,
              proficiency_level: parseInt(newLevel),
            }
          : skill
      );

      await updateUserSkillsMutation.mutateAsync({
        skills: updatedSkills.map((skill) => ({
          skill_id: skill.skill_id,
          proficiency_level: skill.proficiency_level || 1,
        })),
      });

      setEditingSkill(null);
    } catch (error) {
      console.error("Error updating skill level:", error);
    }
  };

  const handleDeleteSkill = async () => {
    if (!skillToDelete) return;

    try {
      const updatedSkills = userSkills.filter(
        (skill) => skill.skill_id !== skillToDelete.skill_id
      );

      await updateUserSkillsMutation.mutateAsync({
        skills: updatedSkills.map((skill) => ({
          skill_id: skill.skill_id,
          proficiency_level: skill.proficiency_level || 1,
        })),
      });

      setSkillToDelete(null);
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-yellow-100 text-yellow-800";
      case 2:
        return "bg-orange-100 text-orange-800";
      case 3:
        return "bg-blue-100 text-blue-800";
      case 4:
        return "bg-green-100 text-green-800";
      case 5:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelStars = (level: number) => {
    return Math.max(1, Math.min(5, level || 1));
  };

  if (userSkills.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
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
              Chưa có kỹ năng nào
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Hãy thêm kỹ năng đầu tiên của bạn để hoàn thiện hồ sơ.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {userSkills.map((userSkill) => (
          <Card
            key={userSkill.skill_id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium text-slate-900">
                      {userSkill.skills.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className={getLevelColor(
                        userSkill.proficiency_level || 1
                      )}
                    >
                      {PROFICIENCY_LEVELS[
                        userSkill.proficiency_level as keyof typeof PROFICIENCY_LEVELS
                      ] || "Level 1"}
                    </Badge>
                  </div>

                  {/* Level Stars */}
                  <div className="flex items-center space-x-1 mt-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`h-4 w-4 ${
                          index <
                          getLevelStars(userSkill.proficiency_level || 1)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {editingSkill === userSkill.skill_id ? (
                    <div className="flex items-center space-x-2">
                      <Select
                        value={userSkill.proficiency_level?.toString() || "1"}
                        onValueChange={(value) =>
                          handleUpdateLevel(userSkill.skill_id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PROFICIENCY_LEVELS).map(
                            ([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingSkill(null)}
                      >
                        Hủy
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingSkill(userSkill.skill_id)}
                        disabled={updateUserSkillsMutation.isPending}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSkillToDelete(userSkill)}
                        disabled={updateUserSkillsMutation.isPending}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        isOpen={!!skillToDelete}
        onClose={() => setSkillToDelete(null)}
        onConfirm={handleDeleteSkill}
        title="Xóa kỹ năng"
        description={`Bạn có chắc chắn muốn xóa kỹ năng "${skillToDelete?.skills.name}" khỏi hồ sơ?`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
        isLoading={updateUserSkillsMutation.isPending}
      />
    </>
  );
}
