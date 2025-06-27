"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateCompany, useUpdateCompany } from "@/hooks/companies";
import { FORM_LABELS, UI } from "@/constants/labels";
import type { Company } from "@/types/custom.types";
import { Building2 } from "lucide-react";

const companyFormSchema = z.object({
  name: z.string().min(2, "Tên công ty phải có ít nhất 2 ký tự"),
  description: z.string().optional(),
  website: z
    .string()
    .url("URL website không hợp lệ")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),

  location: z.string().optional(),
  industry: z.string().optional(),
});

type CompanyFormData = z.infer<typeof companyFormSchema>;

interface CompanyFormProps {
  company?: Company;
  onCancel: () => void;
  onSuccess: (company: Company) => void;
}

export function CompanyForm({
  company,
  onCancel,
  onSuccess,
}: CompanyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createCompanyMutation = useCreateCompany();
  const updateCompanyMutation = useUpdateCompany();

  const isEditing = !!company;

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: company?.name || "",
      description: company?.description || "",
      website: company?.website || "",
      email: company?.email || "",

      location: company?.location || "",
      industry: company?.industry || "",
    },
  });

  const onSubmit = async (data: CompanyFormData) => {
    setIsSubmitting(true);

    try {
      if (isEditing) {
        const result = await updateCompanyMutation.mutateAsync({
          id: company.id,
          ...data,
        });

        if (result.success && result.data) {
          onSuccess(result.data);
        }
      } else {
        // Generate slug from company name
        const slug = data.name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim()
          .replace(/^-|-$/g, "");

        const result = await createCompanyMutation.mutateAsync({
          ...data,
          slug,
        });

        if (result.success && result.data) {
          onSuccess(result.data);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          {isEditing ? "Chỉnh sửa thông tin công ty" : "Tạo thông tin công ty"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.company_name} *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên công ty" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.company_industry}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ví dụ: Công nghệ thông tin"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.company_website}</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.company_email}</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.location}</FormLabel>
                    <FormControl>
                      <Input placeholder="Hà Nội, Việt Nam" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{FORM_LABELS.company_description}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả về công ty, văn hóa doanh nghiệp..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting
                  ? "Đang lưu..."
                  : isEditing
                  ? UI.update
                  : UI.create}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                {UI.cancel}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
