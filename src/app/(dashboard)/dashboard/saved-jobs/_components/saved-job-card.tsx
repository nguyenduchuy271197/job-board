"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import {
  MapPin,
  DollarSign,
  Building2,
  ExternalLink,
  Heart,
  Briefcase,
  Star,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useUnsaveJob } from "@/hooks/saved-jobs";
import { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS } from "@/constants/labels";
import { formatCurrency } from "@/lib/utils";
import type { SavedJobWithDetails } from "@/types/custom.types";

interface SavedJobCardProps {
  savedJob: SavedJobWithDetails;
}

export function SavedJobCard({ savedJob }: SavedJobCardProps) {
  const [showUnsaveDialog, setShowUnsaveDialog] = useState(false);
  const unsaveJobMutation = useUnsaveJob();

  const { jobs: job, created_at } = savedJob;

  const handleUnsaveJob = async () => {
    if (!job) return;

    await unsaveJobMutation.mutateAsync({ job_id: job.id });
    setShowUnsaveDialog(false);
  };

  if (!job) return null;

  const company = job.companies;
  const companyInitials = company?.name
    ? company.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  const salaryText =
    job.salary_min && job.salary_max
      ? `${formatCurrency(job.salary_min)} - ${formatCurrency(job.salary_max)}`
      : job.salary_min
      ? `Từ ${formatCurrency(job.salary_min)}`
      : job.salary_max
      ? `Lên đến ${formatCurrency(job.salary_max)}`
      : "Thỏa thuận";

  const savedTimeText = formatDistanceToNow(new Date(created_at), {
    addSuffix: true,
    locale: vi,
  });

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={company?.logo_url || ""}
                  alt={company?.name || ""}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {companyInitials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <Link href={`/jobs/${job.slug}`} className="group inline-block">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 mt-1">
                  <Link
                    href={`/companies/${company?.slug || ""}`}
                    className="text-muted-foreground hover:text-primary transition-colors font-medium"
                  >
                    {company?.name}
                  </Link>
                  {company?.verified && (
                    <Badge variant="secondary" className="h-5 px-2 text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Đã xác minh
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUnsaveDialog(true)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Heart className="h-4 w-4 fill-current" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Job Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            {job.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{job.location}</span>
                {job.is_remote && (
                  <Badge variant="outline" className="ml-1">
                    Remote
                  </Badge>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{salaryText}</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">
                {
                  EMPLOYMENT_TYPES[
                    job.employment_type as keyof typeof EMPLOYMENT_TYPES
                  ]
                }
              </span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">
                {
                  EXPERIENCE_LEVELS[
                    job.experience_level as keyof typeof EXPERIENCE_LEVELS
                  ]
                }
              </span>
            </div>
          </div>

          {/* Job Description Preview */}
          {job.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {job.description}
            </p>
          )}

          {/* Skills */}
          {job.job_skills && job.job_skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {job.job_skills.slice(0, 4).map((jobSkill) => (
                <Badge key={jobSkill.skills.id} variant="outline">
                  {jobSkill.skills.name}
                </Badge>
              ))}
              {job.job_skills.length > 4 && (
                <Badge variant="outline">
                  +{job.job_skills.length - 4} kỹ năng khác
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Đã lưu {savedTimeText}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/jobs/${job.slug}`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Xem chi tiết
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={showUnsaveDialog}
        onClose={() => setShowUnsaveDialog(false)}
        title="Bỏ lưu việc làm"
        description={`Bạn có chắc chắn muốn bỏ lưu việc làm "${job.title}" không?`}
        confirmText="Bỏ lưu"
        cancelText="Hủy"
        onConfirm={handleUnsaveJob}
        isLoading={unsaveJobMutation.isPending}
        variant="destructive"
      />
    </>
  );
}
