import Link from "next/link";
import {
  Building2,
  MapPin,
  Globe,
  Mail,
  ExternalLink,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { JobDetails } from "@/types/custom.types";

interface JobDetailsSidebarProps {
  job: JobDetails;
}

export function JobDetailsSidebar({ job }: JobDetailsSidebarProps) {
  const company = job.companies;

  return (
    <div className="space-y-6">
      {/* Apply Button - Mobile Sticky */}
      <div className="lg:hidden sticky top-4 z-10">
        <Button size="lg" className="w-full">
          Ứng tuyển ngay
        </Button>
      </div>

      {/* Company Info */}
      {company && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Về công ty</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Company Header */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={company.logo_url || ""} alt={company.name} />
                <AvatarFallback>{company.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{company.name}</h3>
                {company.verified && (
                  <Badge variant="secondary" className="text-xs">
                    Đã xác minh
                  </Badge>
                )}
              </div>
            </div>

            {/* Company Description */}
            {company.description && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {company.description}
              </p>
            )}

            {/* Company Details */}
            <div className="space-y-2 text-sm">
              {company.industry && (
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{company.industry}</span>
                </div>
              )}

              {company.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{company.location}</span>
                </div>
              )}

              {company.website && (
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors flex items-center space-x-1"
                  >
                    <span>Website công ty</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            <Separator />

            {/* Company Actions */}
            <div className="space-y-2">
              <Button
                variant="outline"
                asChild
                className="w-full justify-start"
              >
                <Link href={`/companies/${company.slug}`}>
                  <Building2 className="h-4 w-4 mr-2" />
                  Xem trang công ty
                </Link>
              </Button>

              <Button variant="outline" className="w-full justify-start">
                <Star className="h-4 w-4 mr-2" />
                Theo dõi công ty
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Thông tin liên hệ</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {company?.email && (
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a
                href={`mailto:${company.email}`}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                {company.email}
              </a>
            </div>
          )}

          {company?.location && (
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{company.location}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Job Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">
                {job.application_count || 0}
              </p>
              <p className="text-xs text-muted-foreground">Ứng tuyển</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Apply Button - Desktop */}
      <div className="hidden lg:block sticky top-4">
        <Button size="lg" className="w-full">
          Ứng tuyển ngay
        </Button>
      </div>
    </div>
  );
}
