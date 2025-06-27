"use client";

import { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  MapPin,
  Calendar,
  Award,
  Linkedin,
  Globe,
  FileText,
} from "lucide-react";
import { Loading } from "@/components/shared/loading";
import { getRelativeTime } from "@/constants/labels";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

interface CandidateDetailsDialogProps {
  candidateId: string;
}

export function CandidateDetailsDialog({
  candidateId,
}: CandidateDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "skills" | "cvs">(
    "overview"
  );

  const { data: candidate, isLoading } = useQuery({
    queryKey: ["candidate-details", candidateId],
    queryFn: async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("users")
        .select(
          `
          *,
          user_skills (
            skill_id,
            proficiency_level,
            years_experience,
            skills (
              id,
              name,
              category
            )
          ),
          cvs (
            id,
            title,
            file_url,
            file_name,
            file_size,
            is_primary,
            created_at
          )
        `
        )
        .eq("id", candidateId)
        .eq("role", "candidate")
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!candidateId,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (!candidate) {
    return (
      <div className="text-center py-8">
        <p>Không tìm thấy thông tin ứng viên</p>
      </div>
    );
  }

  const userSkills = candidate.user_skills || [];
  const cvs = candidate.cvs || [];

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Hồ sơ ứng viên: {candidate.full_name || candidate.email}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Basic Info Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">
                  {candidate.full_name || "Ứng viên"}
                </h2>
                <p className="text-muted-foreground">{candidate.email}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  {candidate.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {candidate.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Tham gia {getRelativeTime(candidate.created_at)}
                  </div>
                </div>
              </div>
            </div>

            {candidate.bio && (
              <div>
                <h4 className="text-sm font-medium mb-2">Giới thiệu:</h4>
                <p className="text-sm text-muted-foreground">{candidate.bio}</p>
              </div>
            )}

            {(candidate.linkedin_url || candidate.portfolio_url) && (
              <div className="flex gap-2 mt-4">
                {candidate.linkedin_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={candidate.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-4 w-4 mr-1" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {candidate.portfolio_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={candidate.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      Portfolio
                    </a>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex space-x-1 border-b">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "overview"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Thông tin chi tiết
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "skills"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Kỹ năng ({userSkills.length})
          </button>
          <button
            onClick={() => setActiveTab("cvs")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "cvs"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            CV ({cvs.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Thông tin liên hệ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground">Email</span>
                    <p className="font-medium">{candidate.email}</p>
                  </div>

                  {candidate.phone && (
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Số điện thoại
                      </span>
                      <p className="font-medium">{candidate.phone}</p>
                    </div>
                  )}

                  {candidate.location && (
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Địa điểm
                      </span>
                      <p className="font-medium">{candidate.location}</p>
                    </div>
                  )}

                  <div>
                    <span className="text-xs text-muted-foreground">
                      Ngày tham gia
                    </span>
                    <p className="font-medium">
                      {new Date(candidate.created_at).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-4 text-center">
                  <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{userSkills.length}</p>
                  <p className="text-sm text-muted-foreground">Kỹ năng</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 text-center">
                  <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{cvs.length}</p>
                  <p className="text-sm text-muted-foreground">CV đã tải</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 text-center">
                  <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {Math.floor(
                      (Date.now() - new Date(candidate.created_at).getTime()) /
                        (1000 * 60 * 60 * 24 * 30)
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Tháng hoạt động
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "skills" && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Kỹ năng và chuyên môn
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userSkills.length > 0 ? (
                  <div className="space-y-4">
                    {/* Group skills by category */}
                    {Object.entries(
                      userSkills.reduce(
                        (
                          acc: Record<string, typeof userSkills>,
                          userSkill: (typeof userSkills)[0]
                        ) => {
                          const category = userSkill.skills.category || "Khác";
                          if (!acc[category]) acc[category] = [];
                          acc[category].push(userSkill);
                          return acc;
                        },
                        {} as Record<string, typeof userSkills>
                      )
                    ).map(([category, skills]: [string, typeof userSkills]) => (
                      <div key={category}>
                        <h4 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">
                          {category}
                        </h4>
                        <div className="space-y-2">
                          {skills.map((userSkill: (typeof userSkills)[0]) => (
                            <div
                              key={userSkill.skill_id}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div>
                                <p className="font-medium">
                                  {userSkill.skills.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {userSkill.years_experience}+ năm kinh nghiệm
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i < (userSkill.proficiency_level || 0)
                                        ? "bg-primary"
                                        : "bg-muted"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="mx-auto h-12 w-12 mb-2" />
                    <p>Ứng viên chưa cập nhật kỹ năng</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "cvs" && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  CV và hồ sơ
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cvs.length > 0 ? (
                  <div className="space-y-3">
                    {cvs.map((cv: (typeof cvs)[0]) => (
                      <div
                        key={cv.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{cv.title}</p>
                              {cv.is_primary && (
                                <Badge variant="secondary" className="text-xs">
                                  CV chính
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Tải lên {getRelativeTime(cv.created_at)} •{" "}
                              {cv.file_name}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={cv.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Xem CV
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="mx-auto h-12 w-12 mb-2" />
                    <p>Ứng viên chưa tải lên CV nào</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
