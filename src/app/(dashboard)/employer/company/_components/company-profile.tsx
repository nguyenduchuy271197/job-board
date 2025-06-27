"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Building2,
  Globe,
  Mail,
  MapPin,
  Edit,
  Upload,
  CheckCircle,
  Clock,
} from "lucide-react";
import { CompanyForm } from "./company-form";
import type { CompanyDetails } from "@/types/custom.types";

interface CompanyProfileProps {
  company: CompanyDetails;
}

export function CompanyProfile({ company }: CompanyProfileProps) {
  const [isEditing, setIsEditing] = useState(false);

  const companyInitials = company.name
    ? company.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  const handleEditSuccess = () => {
    setIsEditing(false);
    // The query will automatically refetch due to mutations
  };

  if (isEditing) {
    return (
      <CompanyForm
        company={company}
        onCancel={() => setIsEditing(false)}
        onSuccess={handleEditSuccess}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Company Overview */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={company.logo_url || ""} alt={company.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                  {companyInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">{company.name}</h1>
                  {company.verified ? (
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Đã xác minh
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      Chờ xác minh
                    </Badge>
                  )}
                </div>
                {company.industry && (
                  <p className="text-muted-foreground">{company.industry}</p>
                )}
                {company.location && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {company.location}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Tải logo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Company Description */}
          {company.description && (
            <div>
              <h3 className="font-medium mb-2">Về công ty</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {company.description}
              </p>
            </div>
          )}

          {/* Contact Information */}
          <div>
            <h3 className="font-medium mb-3">Thông tin liên hệ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {company.website}
                  </a>
                </div>
              )}

              {company.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${company.email}`}
                    className="text-primary hover:underline"
                  >
                    {company.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tổng số việc làm
                </p>
                <p className="text-2xl font-bold">{company.jobs_count || 0}</p>
              </div>
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Đang tuyển dụng
                </p>
                <p className="text-2xl font-bold">
                  {company.active_jobs_count || 0}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Thành viên
                </p>
                <p className="text-2xl font-bold">
                  {company.company_members?.length || 0}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Members */}
      {company.company_members && company.company_members.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Thành viên công ty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {company.company_members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={member.users.avatar_url || ""}
                        alt={member.users.full_name || member.users.email}
                      />
                      <AvatarFallback>
                        {(member.users.full_name || member.users.email)
                          .charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {member.users.full_name || member.users.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {member.users.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={member.is_primary ? "default" : "secondary"}
                    >
                      {member.role === "owner" ? "Chủ sở hữu" : "Thành viên"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
