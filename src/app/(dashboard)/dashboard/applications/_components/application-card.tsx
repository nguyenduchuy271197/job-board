"use client";

import { Calendar, MapPin, Building2, Eye, MessageCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { APPLICATION_STATUSES, getRelativeTime } from "@/constants/labels";
import type { ApplicationWithJobAndCandidate } from "@/types/custom.types";

interface ApplicationCardProps {
  application: ApplicationWithJobAndCandidate;
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const { jobs: job } = application;
  const company = job.companies;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "reviewing":
        return "bg-yellow-100 text-yellow-800";
      case "interview":
        return "bg-purple-100 text-purple-800";
      case "offer":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "withdrawn":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={company.logo_url || ""} alt={company.name} />
              <AvatarFallback>
                {company.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {job.title}
              </h3>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <Building2 className="h-4 w-4 mr-1" />
                <span className="truncate">{company.name}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                {job.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{job.location}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    Ứng tuyển {getRelativeTime(application.applied_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Badge className={getStatusColor(application.status)}>
            {
              APPLICATION_STATUSES[
                application.status as keyof typeof APPLICATION_STATUSES
              ]
            }
          </Badge>
        </div>
      </CardHeader>

      {application.cover_letter && (
        <CardContent className="py-2">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-700 line-clamp-3">
              {application.cover_letter}
            </p>
          </div>
        </CardContent>
      )}

      <CardFooter className="flex items-center justify-between pt-4">
        <div className="text-sm text-gray-500">
          Cập nhật {getRelativeTime(application.updated_at)}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Chi tiết
          </Button>

          {(application.status === "interview" ||
            application.status === "offer") && (
            <Button variant="outline" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              Tin nhắn
            </Button>
          )}

          {application.status === "submitted" && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              Rút đơn
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
