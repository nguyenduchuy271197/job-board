"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useSaveJob, useUnsaveJob } from "@/hooks/saved-jobs";
import { cn } from "@/lib/utils";

interface SaveJobButtonProps {
  jobId: string;
  isSaved: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
  className?: string;
}

export function SaveJobButton({
  jobId,
  isSaved,
  variant = "outline",
  size = "default",
  showText = true,
  className,
}: SaveJobButtonProps) {
  const [showUnsaveDialog, setShowUnsaveDialog] = useState(false);
  const saveJobMutation = useSaveJob();
  const unsaveJobMutation = useUnsaveJob();

  const isLoading = saveJobMutation.isPending || unsaveJobMutation.isPending;

  const handleToggleSave = async () => {
    if (isSaved) {
      setShowUnsaveDialog(true);
    } else {
      await saveJobMutation.mutateAsync({ job_id: jobId });
    }
  };

  const handleUnsaveJob = async () => {
    await unsaveJobMutation.mutateAsync({ job_id: jobId });
    setShowUnsaveDialog(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleToggleSave}
        disabled={isLoading}
        className={cn(
          isSaved &&
            variant === "outline" &&
            "border-red-200 text-red-600 hover:bg-red-50",
          isSaved &&
            variant === "ghost" &&
            "text-red-600 hover:bg-red-50 hover:text-red-700",
          className
        )}
      >
        <Heart
          className={cn(
            "h-4 w-4",
            showText && size !== "icon" && "mr-2",
            isSaved && "fill-current"
          )}
        />
        {showText && size !== "icon" && (
          <span>{isSaved ? "Đã lưu" : "Lưu việc làm"}</span>
        )}
      </Button>

      <ConfirmDialog
        isOpen={showUnsaveDialog}
        onClose={() => setShowUnsaveDialog(false)}
        title="Bỏ lưu việc làm"
        description="Bạn có chắc chắn muốn bỏ lưu việc làm này không?"
        confirmText="Bỏ lưu"
        cancelText="Hủy"
        onConfirm={handleUnsaveJob}
        isLoading={unsaveJobMutation.isPending}
        variant="destructive"
      />
    </>
  );
}
