"use client";

import { useState } from "react";
import { Send, Upload, FileText, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import type { JobDetails } from "@/types/custom.types";

interface JobApplyDialogProps {
  job: JobDetails;
}

export function JobApplyDialog({ job }: JobApplyDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    cover_letter: "",
    resume: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement job application submission using server actions
      // const formDataToSend = new FormData();
      // formDataToSend.append("job_id", job.id);
      // formDataToSend.append("full_name", formData.full_name);
      // formDataToSend.append("email", formData.email);
      // formDataToSend.append("phone", formData.phone);
      // formDataToSend.append("cover_letter", formData.cover_letter);
      // if (formData.resume) {
      //   formDataToSend.append("resume", formData.resume);
      // }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Ứng tuyển thành công! Chúng tôi sẽ liên hệ với bạn sớm.");
      setIsOpen(false);
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        cover_letter: "",
        resume: null,
      });
    } catch {
      toast.error("Có lỗi xảy ra khi gửi hồ sơ. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Chỉ chấp nhận file PDF, DOC, DOCX");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File không được vượt quá 5MB");
        return;
      }

      setFormData((prev) => ({ ...prev, resume: file }));
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, resume: null }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full lg:w-auto">
          <Send className="h-4 w-4 mr-2" />
          Ứng tuyển ngay
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ứng tuyển: {job.title}</DialogTitle>
          <DialogDescription>
            Tại {job.companies?.name} • {job.location}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Thông tin cá nhân</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">
                  Họ và tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      full_name: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                Số điện thoại <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>

          {/* Resume Upload */}
          <div className="space-y-4">
            <h3 className="font-semibold">CV/Resume</h3>

            {formData.resume ? (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">
                        {formData.resume.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({(formData.resume.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Tải lên CV/Resume của bạn
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Hỗ trợ: PDF, DOC, DOCX (Tối đa 5MB)
                  </p>
                  <Label htmlFor="resume" className="cursor-pointer">
                    <Button type="button" variant="outline" size="sm">
                      Chọn file
                    </Button>
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </Label>
                </div>
              </div>
            )}
          </div>

          {/* Cover Letter */}
          <div className="space-y-2">
            <Label htmlFor="cover_letter">Thư xin việc</Label>
            <Textarea
              id="cover_letter"
              placeholder="Chia sẻ lý do bạn quan tâm đến vị trí này và những gì bạn có thể đóng góp cho công ty..."
              value={formData.cover_letter}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  cover_letter: e.target.value,
                }))
              }
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Application Instructions */}
          {job.requirements && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-amber-800 mb-2">
                  Yêu cầu công việc:
                </h4>
                <div
                  className="text-sm text-amber-700"
                  dangerouslySetInnerHTML={{
                    __html: job.requirements,
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* Submit Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.full_name ||
                !formData.email ||
                !formData.phone
              }
              className="flex-1 sm:flex-initial"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Gửi hồ sơ ứng tuyển
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
