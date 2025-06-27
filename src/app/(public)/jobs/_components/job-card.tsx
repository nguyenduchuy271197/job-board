import Link from "next/link";
import {
  MapPin,
  Clock,
  DollarSign,
  Building,
  Calendar,
  Bookmark,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS } from "@/constants/labels";
import type { JobWithCompanyAndSkills } from "@/types/custom.types";

interface JobCardProps {
  job: JobWithCompanyAndSkills;
}

export function JobCard({ job }: JobCardProps) {
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Thỏa thuận";
    if (min && max) return `${min} - ${max} triệu`;
    if (min) return `Từ ${min} triệu`;
    if (max) return `Đến ${max} triệu`;
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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Company Avatar */}
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarImage
              src={job.companies?.logo_url || ""}
              alt={job.companies?.name || "Company"}
            />
            <AvatarFallback>
              {job.companies?.name?.charAt(0) || "C"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Job Title */}
                <Link href={`/jobs/${job.slug}`}>
                  <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                </Link>

                {/* Company Info */}
                <div className="flex items-center space-x-2 mt-1 mb-3">
                  <Link
                    href={`/companies/${job.companies?.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {job.companies?.name}
                  </Link>
                  {job.companies?.verified && (
                    <Badge variant="secondary" className="text-xs">
                      Đã xác minh
                    </Badge>
                  )}
                </div>

                {/* Job Info */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-3">
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
                {job.job_skills && job.job_skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {job.job_skills.slice(0, 3).map((jobSkill) => (
                      <Badge
                        key={jobSkill.skills.name}
                        variant="outline"
                        className="text-xs"
                      >
                        {jobSkill.skills.name}
                      </Badge>
                    ))}
                    {job.job_skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{job.job_skills.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Job Description Preview */}
                {job.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {job.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 ml-4">
                <Button variant="ghost" size="icon">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button asChild>
                  <Link href={`/jobs/${job.slug}`}>Xem chi tiết</Link>
                </Button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t">
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(job.created_at)}</span>
                </div>

                {job.is_remote && (
                  <Badge variant="secondary" className="text-xs">
                    Remote
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
