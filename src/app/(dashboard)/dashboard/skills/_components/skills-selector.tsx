"use client";

import { useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUpdateUserSkills } from "@/hooks/skills";
import { PROFICIENCY_LEVELS } from "@/constants/labels";
import type { Skill, UserSkill } from "@/types/custom.types";

type UserSkillWithSkill = UserSkill & {
  skills: Skill;
};

interface SkillsSelectorProps {
  allSkills: Skill[];
  userSkills: UserSkillWithSkill[];
}

export function SkillsSelector({ allSkills, userSkills }: SkillsSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<Record<string, string>>(
    {}
  );
  const updateUserSkillsMutation = useUpdateUserSkills();

  // Lọc kỹ năng chưa có trong user skills
  const availableSkills = useMemo(() => {
    const userSkillIds = new Set(userSkills.map((us) => us.skill_id));
    return allSkills.filter((skill) => !userSkillIds.has(skill.id));
  }, [allSkills, userSkills]);

  // Tìm kiếm kỹ năng
  const filteredSkills = useMemo(() => {
    if (!searchTerm) return availableSkills.slice(0, 20); // Chỉ hiển thị 20 kỹ năng đầu tiên

    return availableSkills
      .filter((skill) =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 20);
  }, [availableSkills, searchTerm]);

  const handleSkillSelect = (skillId: string, level: string) => {
    setSelectedSkills((prev) => ({
      ...prev,
      [skillId]: level,
    }));
  };

  const handleSkillRemove = (skillId: string) => {
    setSelectedSkills((prev) => {
      const newSelected = { ...prev };
      delete newSelected[skillId];
      return newSelected;
    });
  };

  const handleAddSkills = async () => {
    if (Object.keys(selectedSkills).length === 0) return;

    try {
      const newSkills = Object.entries(selectedSkills).map(
        ([skillId, level]) => ({
          skill_id: skillId,
          proficiency_level: parseInt(level),
        })
      );

      const allUserSkills = [
        ...userSkills.map((skill) => ({
          skill_id: skill.skill_id,
          proficiency_level: skill.proficiency_level || 1,
        })),
        ...newSkills,
      ];

      await updateUserSkillsMutation.mutateAsync({
        skills: allUserSkills,
      });

      setSelectedSkills({});
      setSearchTerm("");
    } catch (error) {
      console.error("Error adding skills:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm kỹ năng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Selected Skills */}
      {Object.keys(selectedSkills).length > 0 && (
        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-slate-900">Kỹ năng đã chọn</h4>
              <Button
                onClick={handleAddSkills}
                disabled={updateUserSkillsMutation.isPending}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm ({Object.keys(selectedSkills).length})
              </Button>
            </div>

            <div className="space-y-2">
              {Object.entries(selectedSkills).map(([skillId, level]) => {
                const skill = allSkills.find((s) => s.id === skillId);
                if (!skill) return null;

                return (
                  <div
                    key={skillId}
                    className="flex items-center justify-between bg-white rounded-lg p-2"
                  >
                    <span className="font-medium">{skill.name}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        {
                          PROFICIENCY_LEVELS[
                            parseInt(level) as keyof typeof PROFICIENCY_LEVELS
                          ]
                        }
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSkillRemove(skillId)}
                        className="h-6 w-6 p-0 text-red-600"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Skills */}
      <div className="space-y-3">
        {filteredSkills.length > 0 ? (
          filteredSkills.map((skill) => (
            <Card key={skill.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900">{skill.name}</h3>
                    {skill.category && (
                      <p className="text-sm text-slate-500 mt-1">
                        {skill.category}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Select
                      value={selectedSkills[skill.id] || ""}
                      onValueChange={(value) =>
                        handleSkillSelect(skill.id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Chọn level" />
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

                    {selectedSkills[skill.id] && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSkillRemove(skill.id)}
                        className="text-red-600"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">
                {searchTerm
                  ? `Không tìm thấy kỹ năng nào với từ khóa "${searchTerm}"`
                  : "Không có kỹ năng nào khả dụng để thêm"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {availableSkills.length > 20 && !searchTerm && (
        <p className="text-sm text-gray-500 text-center">
          Hiển thị 20 kỹ năng đầu tiên. Sử dụng tìm kiếm để xem thêm.
        </p>
      )}
    </div>
  );
}
