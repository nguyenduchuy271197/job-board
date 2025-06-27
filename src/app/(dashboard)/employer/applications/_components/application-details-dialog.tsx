"use client";

import { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, FileText, Download, Linkedin, Globe, Award } from "lucide-react";
import { Loading } from "@/components/shared/loading";
import { getApplicationStatusLabel, getRelativeTime } from "@/constants/labels";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { ApplicationWithUserAndCV } from "@/types/custom.types";

interface ApplicationDetailsDialogProps {
  applicationId: string;
}

export function ApplicationDetailsDialog({
  applicationId,
}: ApplicationDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "cv" | "skills">(
    "overview"
  );

  const { data: application, isLoading } = useQuery({
    queryKey: ["application-details", applicationId],
    queryFn: async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("applications")
        .select(
          `
          *,
          users:user_id (
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
            )
          ),
          cvs:resume_url (
            id,
            title,
            file_url,
            file_name,
            file_size,
            is_primary,
            created_at
          ),
          jobs (
            id,
            title,
            company_id,
            companies (
              name
            )
          )
        `
        )
        .eq("id", applicationId)
        .single();

      if (error) throw error;
      return data as ApplicationWithUserAndCV;
    },
    enabled: !!applicationId,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (!application) {
    return (
      <div className="text-center py-8">
        <p>Không tìm thấy thông tin ứng tuyển</p>
      </div>
    );
  }

  const user = application.users;
  const userSkills = user.user_skills || [];

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Chi tiết ứng viên: {user.full_name || user.email}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Application Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Thông tin ứng tuyển
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Vị trí ứng tuyển:
              </span>
              <span className="font-medium">{application.jobs.title}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Trạng thái:</span>
              <Badge variant="outline">
                {getApplicationStatusLabel(application.status)}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Thời gian ứng tuyển:
              </span>
              <span className="text-sm">
                {getRelativeTime(application.applied_at)}
              </span>
            </div>

            {application.cover_letter && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-2">Thư xin việc:</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {application.cover_letter}
                  </p>
                </div>
              </>
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
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab("cv")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "cv"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            CV & Hồ sơ
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "skills"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Kỹ năng
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Personal Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Thông tin cá nhân
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Họ và tên
                    </span>
                    <p className="font-medium">
                      {user.full_name || "Chưa cập nhật"}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground">Email</span>
                    <p className="font-medium">{user.email}</p>
                  </div>

                  {user.phone && (
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Số điện thoại
                      </span>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  )}

                  {user.location && (
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Địa điểm
                      </span>
                      <p className="font-medium">{user.location}</p>
                    </div>
                  )}
                </div>

                {user.bio && (
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Giới thiệu
                    </span>
                    <p className="text-sm mt-1">{user.bio}</p>
                  </div>
                )}

                {(user.linkedin_url || user.portfolio_url) && (
                  <div className="flex gap-2 pt-2">
                    {user.linkedin_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={user.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="h-4 w-4 mr-1" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {user.portfolio_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={user.portfolio_url}
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
          </div>
        )}

        {activeTab === "cv" && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  CV đã tải lên
                </CardTitle>
              </CardHeader>
              <CardContent>
                {application.resume_url ? (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">CV ứng tuyển</p>
                        <p className="text-sm text-muted-foreground">
                          Tải lên {getRelativeTime(application.applied_at)}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={application.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Tải xuống
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="mx-auto h-12 w-12 mb-2" />
                    <p>Ứng viên chưa tải lên CV</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "skills" && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Kỹ năng ({userSkills.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userSkills.length > 0 ? (
                  <div className="space-y-3">
                    {userSkills.map((userSkill) => (
                      <div
                        key={userSkill.skill_id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{userSkill.skills.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {userSkill.skills.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
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
                          <p className="text-xs text-muted-foreground">
                            {userSkill.years_experience}+ năm kinh nghiệm
                          </p>
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
      </div>
    </>
  );
}
