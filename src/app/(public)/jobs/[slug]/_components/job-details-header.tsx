import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  Share2,
  MapPin,
  Clock,
  DollarSign,
  Building,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS } from "@/constants/labels";
import type { JobDetails } from "@/types/custom.types";

interface JobDetailsHeaderProps {
  job: JobDetails;
}

export function JobDetailsHeader({ job }: JobDetailsHeaderProps) {
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Thỏa thuận";
    if (min && max) return `${min} - ${max} triệu VNĐ`;
    if (min) return `Từ ${min} triệu VNĐ`;
    if (max) return `Đến ${max} triệu VNĐ`;
    return "Thỏa thuận";
  };

  const formatDate = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: vi,
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="bg-card border rounded-lg p-6">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="p-0">
          <Link href="/jobs" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại danh sách việc làm</span>
          </Link>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Left Side - Job Info */}
        <div className="flex-1">
          <div className="flex items-start space-x-4">
            {/* Company Avatar */}
            <Avatar className="h-16 w-16 flex-shrink-0">
              <AvatarImage
                src={job.companies?.logo_url || ""}
                alt={job.companies?.name || "Company"}
              />
              <AvatarFallback className="text-lg">
                {job.companies?.name?.charAt(0) || "C"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              {/* Job Title */}
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                {job.title}
              </h1>

              {/* Company Info */}
              <div className="flex items-center space-x-3 mb-4">
                <Link
                  href={`/companies/${job.companies?.slug}`}
                  className="text-lg text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  {job.companies?.name}
                </Link>
                {job.companies?.verified && (
                  <Badge variant="secondary">Đã xác minh</Badge>
                )}
              </div>

              {/* Job Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                {job.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                )}

                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{EMPLOYMENT_TYPES[job.employment_type]}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span>
                    {formatSalary(
                      job.salary_min ?? undefined,
                      job.salary_max ?? undefined
                    )}
                  </span>
                </div>

                {job.experience_level && (
                  <div className="flex items-center space-x-1">
                    <Building className="h-4 w-4" />
                    <span>{EXPERIENCE_LEVELS[job.experience_level]}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {job.is_remote && <Badge variant="secondary">Remote</Badge>}
                {job.job_skills?.slice(0, 5).map((jobSkill) => (
                  <Badge key={jobSkill.skills.name} variant="outline">
                    {jobSkill.skills.name}
                  </Badge>
                ))}
                {job.job_skills && job.job_skills.length > 5 && (
                  <Badge variant="outline">
                    +{job.job_skills.length - 5} kỹ năng khác
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-3 lg:space-y-0 lg:space-x-3">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Flag className="h-4 w-4" />
            </Button>
          </div>

          <Button size="lg" className="w-full lg:w-auto">
            Ứng tuyển ngay
          </Button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 pt-4 border-t text-sm text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>Đăng {formatDate(job.created_at)}</span>
          {job.application_count && job.application_count > 0 && (
            <span>{job.application_count} đơn ứng tuyển</span>
          )}
        </div>
      </div>
    </div>
  );
}
