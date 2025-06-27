"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  User,
  Eye,
  Plus,
  X,
} from "lucide-react";
import { useSearchCandidates } from "@/hooks/search";
import { useSkills } from "@/hooks/skills";
import { Loading } from "@/components/shared/loading";
import { EXPERIENCE_LEVELS, EMPLOYMENT_TYPES, UI } from "@/constants/labels";
import type {
  ExperienceLevel,
  EmploymentType,
  SearchCandidatesInput,
} from "@/types/custom.types";
import { CandidateDetailsDialog } from "./candidate-details-dialog";
import { Checkbox } from "@/components/ui/checkbox";

export function CandidateSearch() {
  const [filters, setFilters] = useState<SearchCandidatesInput>({
    query: "",
    page: 1,
    limit: 20,
    sort_by: "relevance",
    sort_order: "desc",
  });

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  // const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
  //   null
  // );

  const { data: candidatesData, isLoading } = useSearchCandidates(filters);
  const { data: skillsData } = useSkills({ page: 1, limit: 100 });

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      skills: selectedSkills.length > 0 ? selectedSkills : undefined,
    }));
  };

  const handleSkillToggle = (skillId: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  };

  const resetFilters = () => {
    setFilters({
      query: "",
      page: 1,
      limit: 20,
      sort_by: "relevance",
      sort_order: "desc",
    });
    setSelectedSkills([]);
  };

  const availableSkills = skillsData?.skills || [];
  const candidates = candidatesData?.candidates || [];

  const selectedSkillNames = availableSkills
    .filter((skill) => selectedSkills.includes(skill.id))
    .map((skill) => skill.name);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Tìm kiếm ứng viên
            </CardTitle>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Bộ lọc nâng cao
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Search */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, kỹ năng, kinh nghiệm..."
                value={filters.query || ""}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, query: e.target.value }))
                }
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Tìm kiếm
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Location */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Địa điểm
                  </label>
                  <Input
                    placeholder="Nhập địa điểm..."
                    value={filters.location || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Experience Level */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Mức kinh nghiệm
                  </label>
                  <Select
                    value={filters.experience_level || ""}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        experience_level:
                          (value as ExperienceLevel) || undefined,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn mức kinh nghiệm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả</SelectItem>
                      {Object.entries(EXPERIENCE_LEVELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Years Experience */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Số năm kinh nghiệm (tối thiểu)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="50"
                    value={filters.min_years_experience || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        min_years_experience: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      }))
                    }
                  />
                </div>

                {/* Employment Types */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Loại hình làm việc
                  </label>
                  <Select
                    value={filters.employment_types?.[0] || ""}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        employment_types: value
                          ? [value as EmploymentType]
                          : undefined,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại hình" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả</SelectItem>
                      {Object.entries(EMPLOYMENT_TYPES).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Skills Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Kỹ năng yêu cầu
                </label>
                <div className="space-y-2">
                  {selectedSkillNames.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedSkillNames.map((skillName, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {skillName}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => {
                              const skillId = availableSkills.find(
                                (s) => s.name === skillName
                              )?.id;
                              if (skillId) handleSkillToggle(skillId);
                            }}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Thêm kỹ năng
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Chọn kỹ năng</DialogTitle>
                      </DialogHeader>
                      <div className="max-h-96 overflow-y-auto space-y-2">
                        {availableSkills.map((skill) => (
                          <div
                            key={skill.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={skill.id}
                              checked={selectedSkills.includes(skill.id)}
                              onCheckedChange={() =>
                                handleSkillToggle(skill.id)
                              }
                            />
                            <label htmlFor={skill.id} className="text-sm">
                              {skill.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex gap-2">
                <Button onClick={handleSearch}>Áp dụng bộ lọc</Button>
                <Button variant="outline" onClick={resetFilters}>
                  Đặt lại
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {isLoading ? (
          <Loading />
        ) : candidates.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Không tìm thấy ứng viên nào
                </h3>
                <p className="text-muted-foreground">
                  Thử điều chỉnh tiêu chí tìm kiếm để có kết quả phù hợp hơn.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Tìm thấy {candidates.length} ứng viên
              </p>

              <Select
                value={filters.sort_by}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    sort_by: value as
                      | "relevance"
                      | "created_at"
                      | "updated_at"
                      | "experience",
                  }))
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Độ phù hợp</SelectItem>
                  <SelectItem value="created_at">Mới nhất</SelectItem>
                  <SelectItem value="updated_at">Cập nhật gần đây</SelectItem>
                  <SelectItem value="experience">Kinh nghiệm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {candidates.map((candidate) => (
              <Card
                key={candidate.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold">
                            {candidate.full_name || "Ứng viên"}
                          </h3>
                          <p className="text-muted-foreground">
                            {candidate.email}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {candidate.bio && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {candidate.bio}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          {candidate.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {candidate.location}
                            </div>
                          )}

                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Tham gia từ{" "}
                            {new Date(candidate.created_at).getFullYear()}
                          </div>
                        </div>

                        {/* Skills */}
                        {candidate.user_skills &&
                          candidate.user_skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {candidate.user_skills
                                .slice(0, 5)
                                .map((userSkill) => (
                                  <Badge
                                    key={userSkill.skill_id}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {userSkill.skills.name}
                                  </Badge>
                                ))}
                              {candidate.user_skills.length > 5 && (
                                <Badge variant="outline" className="text-xs">
                                  +{candidate.user_skills.length - 5} kỹ năng
                                  khác
                                </Badge>
                              )}
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            {UI.view}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <CandidateDetailsDialog candidateId={candidate.id} />
                        </DialogContent>
                      </Dialog>

                      {/* Message functionality - to be implemented
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCandidate(candidate.id)}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Nhắn tin
                      </Button>
                      */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
