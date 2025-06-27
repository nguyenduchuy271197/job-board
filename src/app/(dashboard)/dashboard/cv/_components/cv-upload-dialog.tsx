"use client";

import { useState } from "react";
import { Upload, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import { useUploadCV } from "@/hooks/cvs";
import { z } from "zod";

// Schema for CV upload form (client-side)
const cvUploadFormSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề CV là bắt buộc")
    .max(100, "Tiêu đề CV không được quá 100 ký tự"),
  is_primary: z.boolean(),
  file: z
    .instanceof(File, { message: "File CV là bắt buộc" })
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "File CV không được vượt quá 10MB"
    )
    .refine((file) => {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      return allowedTypes.includes(file.type);
    }, "Chỉ chấp nhận file PDF, DOC, DOCX"),
});

type CVUploadFormInput = z.infer<typeof cvUploadFormSchema>;

export function CVUploadDialog() {
  const [open, setOpen] = useState(false);
  const uploadCVMutation = useUploadCV();

  const form = useForm<CVUploadFormInput>({
    resolver: zodResolver(cvUploadFormSchema),
    defaultValues: {
      title: "",
      is_primary: false,
    },
  });

  const onSubmit = async (data: CVUploadFormInput) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("is_primary", data.is_primary.toString());
      formData.append("file", data.file);

      await uploadCVMutation.mutateAsync(formData);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error uploading CV:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tải lên CV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tải lên CV mới</DialogTitle>
          <DialogDescription>
            Chọn file CV và điền thông tin để tải lên. Hỗ trợ định dạng PDF,
            DOC, DOCX.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề CV</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: CV Frontend Developer"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>File CV</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        {...field}
                        value=""
                      />
                      <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_primary"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Đặt làm CV chính</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      CV chính sẽ được sử dụng mặc định khi ứng tuyển
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={uploadCVMutation.isPending}>
                {uploadCVMutation.isPending ? "Đang tải lên..." : "Tải lên"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
