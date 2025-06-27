import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Target, Users, Calendar } from "lucide-react";
import type { JobDetails } from "@/types/custom.types";

interface JobDetailsContentProps {
  job: JobDetails;
}

export function JobDetailsContent({ job }: JobDetailsContentProps) {
  const sections = [
    {
      icon: FileText,
      title: "Mô tả công việc",
      content: job.description,
    },
    {
      icon: Target,
      title: "Yêu cầu công việc",
      content: job.requirements,
    },
  ];

  return (
    <div className="space-y-6">
      {sections.map((section) => {
        if (!section.content) return null;

        return (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <section.icon className="h-5 w-5" />
                <span>{section.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </CardContent>
          </Card>
        );
      })}

      {/* Skills Required */}
      {job.job_skills && job.job_skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Kỹ năng yêu cầu</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {job.job_skills.map((jobSkill) => (
                <Badge key={jobSkill.skills.name} variant="secondary">
                  {jobSkill.skills.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Important Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Thông tin quan trọng</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Ngày đăng:</span>
              <p className="font-medium">
                {new Date(job.created_at).toLocaleDateString("vi-VN")}
              </p>
            </div>

            {job.published_at && (
              <div>
                <span className="text-muted-foreground">Ngày đăng:</span>
                <p className="font-medium">
                  {new Date(job.published_at).toLocaleDateString("vi-VN")}
                </p>
              </div>
            )}

            {job.application_count && job.application_count > 0 && (
              <div>
                <span className="text-muted-foreground">
                  Số lượng ứng tuyển:
                </span>
                <p className="font-medium">{job.application_count} người</p>
              </div>
            )}
          </div>

          {job.is_remote && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-sm font-medium">
                🏠 Hỗ trợ làm việc từ xa
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
