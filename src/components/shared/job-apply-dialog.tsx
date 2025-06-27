"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileText, Download, Eye } from "lucide-react";
import { useApplyJob } from "@/hooks/applications";
import { useUserCVs } from "@/hooks/cvs";
import { Loading } from "@/components/shared/loading";
import { APPLICATION_ERRORS } from "@/constants/error-messages";
import type { JobDetails } from "@/types/custom.types";

const applyJobFormSchema = z.object({
  cv_id: z.string().min(1, "Vui lòng chọn CV"),
  cover_letter: z
    .string()
    .max(1000, "Thư xin việc không được quá 1000 ký tự")
    .optional(),
});

type ApplyJobFormData = z.infer<typeof applyJobFormSchema>;

interface JobApplyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobDetails;
}

export default function JobApplyDialog({
  isOpen,
  onClose,
  job,
}: JobApplyDialogProps) {
  const { data: userCVs, isLoading: isLoadingCVs } = useUserCVs();
  const applyJobMutation = useApplyJob();

  const form = useForm<ApplyJobFormData>({
    resolver: zodResolver(applyJobFormSchema),
    defaultValues: {
      cv_id: "",
      cover_letter: "",
    },
  });

  const onSubmit = async (data: ApplyJobFormData) => {
    const selectedCV = userCVs?.find((cv) => cv.id === data.cv_id);

    await applyJobMutation.mutateAsync({
      job_id: job.id,
      resume_url: selectedCV?.file_url || undefined,
      cover_letter: data.cover_letter || undefined,
    });

    form.reset();
    onClose();
  };

  const cvs = userCVs || [];
  const hasCVs = cvs.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ứng tuyển vào vị trí</DialogTitle>
          <div className="text-sm text-muted-foreground">
            <div className="font-medium">{job.title}</div>
            <div>{job.companies.name}</div>
          </div>
        </DialogHeader>

        {isLoadingCVs ? (
          <Loading text="Đang tải CV..." />
        ) : !hasCVs ? (
          <div className="py-6 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Bạn chưa có CV nào
            </h3>
            <p className="text-gray-500 mb-4">
              {APPLICATION_ERRORS.CV_REQUIRED}
            </p>
            <Button onClick={onClose}>Đóng</Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* CV Selection */}
              <FormField
                control={form.control}
                name="cv_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chọn CV để ứng tuyển</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-3"
                      >
                        {cvs.map((cv) => (
                          <div
                            key={cv.id}
                            className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                          >
                            <RadioGroupItem value={cv.id} id={cv.id} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <label
                                  htmlFor={cv.id}
                                  className="text-sm font-medium cursor-pointer truncate"
                                >
                                  {cv.title}
                                  {cv.is_primary && (
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                      Chính
                                    </span>
                                  )}
                                </label>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {cv.file_url && (
                                <>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      window.open(cv.file_url!, "_blank")
                                    }
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const link = document.createElement("a");
                                      link.href = cv.file_url!;
                                      link.download = cv.file_name || "CV.pdf";
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                    }}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cover Letter */}
              <FormField
                control={form.control}
                name="cover_letter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thư xin việc (không bắt buộc)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Giới thiệu về bản thân và lý do bạn phù hợp với vị trí này..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <div className="text-xs text-muted-foreground text-right">
                      {field.value?.length || 0}/1000
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={applyJobMutation.isPending}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={applyJobMutation.isPending}
                  className="min-w-[100px]"
                >
                  {applyJobMutation.isPending ? "Đang gửi..." : "Ứng tuyển"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
