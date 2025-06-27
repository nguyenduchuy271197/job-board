"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Star,
  Trash2,
  Eye,
  Calendar,
  MoreVertical,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useDeleteCV } from "@/hooks/cvs";
import { getRelativeTime } from "@/constants/labels";
import type { CV } from "@/types/custom.types";

interface CVCardProps {
  cv: CV;
}

export function CVCard({ cv }: CVCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteCVMutation = useDeleteCV();

  const handleDelete = async () => {
    try {
      await deleteCVMutation.mutateAsync({ cv_id: cv.id });
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting CV:", error);
    }
  };

  const handleDownload = () => {
    if (cv.file_url) {
      window.open(cv.file_url, "_blank");
    } else {
      toast.error("Không thể tải xuống CV");
    }
  };

  const handleView = () => {
    if (cv.file_url) {
      window.open(cv.file_url, "_blank");
    } else {
      toast.error("Không thể xem CV");
    }
  };

  return (
    <>
      <Card className={`h-full ${cv.is_primary ? "ring-2 ring-blue-500" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-slate-900 truncate">
                {cv.title}
              </h3>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleView}>
                  <Eye className="h-4 w-4 mr-2" />
                  Xem CV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Tải xuống
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa CV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {cv.is_primary && (
            <Badge variant="default" className="w-fit">
              <Star className="h-3 w-3 mr-1 fill-current" />
              CV chính
            </Badge>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* File Info */}
          <div className="space-y-2 text-sm text-slate-600">
            {cv.file_name && (
              <div className="flex items-center justify-between">
                <span>Tên file:</span>
                <span className="truncate ml-2 max-w-32" title={cv.file_name}>
                  {cv.file_name}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span>Tải lên:</span>
              <span className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {getRelativeTime(cv.created_at)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleView}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              Xem
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Tải
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Xóa CV"
        description={`Bạn có chắc chắn muốn xóa CV "${cv.title}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
        isLoading={deleteCVMutation.isPending}
      />
    </>
  );
}
