"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useCreateJob, useUpdateJob } from "@/hooks/jobs";
import { useSkills } from "@/hooks/skills";
import {
  FORM_LABELS,
  UI,
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
} from "@/constants/labels";
import type { JobDetails } from "@/types/custom.types";
import { Briefcase, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const jobFormSchema = z.object({
  title: z.string().min(5, "Tiêu đề công việc phải có ít nhất 5 ký tự"),
  description: z.string().min(50, "Mô tả công việc phải có ít nhất 50 ký tự"),
  requirements: z.string().optional(),
  location: z.string().optional(),
  is_remote: z.boolean(),
  employment_type: z.enum([
    "full_time",
    "part_time",
    "contract",
    "internship",
    "freelance",
  ]),
  experience_level: z.enum([
    "entry",
    "junior",
    "mid",
    "senior",
    "lead",
    "executive",
  ]),
  salary_min: z.number().min(0).optional(),
  salary_max: z.number().min(0).optional(),
  currency: z.string().optional(),
  status: z.enum(["draft", "published"]),
  skills: z.array(z.string()).optional(),
});

type JobFormData = z.infer<typeof jobFormSchema>;

interface JobFormProps {
  job?: JobDetails;
}

export function JobForm({ job }: JobFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [currentUserCompany, setCurrentUserCompany] = useState<string | null>(
    null
  );

  const createJobMutation = useCreateJob();
  const updateJobMutation = useUpdateJob();
  const { data: skillsData } = useSkills({});

  const isEditing = !!job;

  // Get current user's company
  useEffect(() => {
    async function getUserCompany() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data: companyMember } = await supabase
          .from("company_members")
          .select("company_id")
          .eq("user_id", user.id)
          .single();

        if (companyMember) {
          setCurrentUserCompany(companyMember.company_id);
        }
      } catch (error) {
        console.error("Error getting user company:", error);
      }
    }

    getUserCompany();
  }, []);

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: job?.title || "",
      description: job?.description || "",
      requirements: job?.requirements || "",
      location: job?.location || "",
      is_remote: job?.is_remote || false,
      employment_type: job?.employment_type || "full_time",
      experience_level: job?.experience_level || "mid",
      salary_min: job?.salary_min || undefined,
      salary_max: job?.salary_max || undefined,
      currency: job?.currency || "VND",
      status: job?.status === "published" ? "published" : "draft",
      skills: job?.job_skills?.map((js) => js.skills.id) || [],
    },
  });

  useEffect(() => {
    if (job?.job_skills) {
      setSelectedSkills(job.job_skills.map((js) => js.skills.id));
    }
  }, [job]);

  const onSubmit = async (data: JobFormData) => {
    if (!currentUserCompany) {
      alert("Bạn cần có thông tin công ty để đăng tin tuyển dụng");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...data,
        company_id: currentUserCompany,
        skills: selectedSkills,
        currency: data.currency || "VND",
      };

      if (isEditing) {
        const result = await updateJobMutation.mutateAsync({
          id: job.id,
          ...submitData,
        });

        if (result.success) {
          router.push("/employer/jobs");
        }
      } else {
        const result = await createJobMutation.mutateAsync(submitData);

        if (result.success) {
          router.push("/employer/jobs");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSkill = (skillId: string) => {
    if (!selectedSkills.includes(skillId)) {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  const removeSkill = (skillId: string) => {
    setSelectedSkills(selectedSkills.filter((id) => id !== skillId));
  };

  const availableSkills = skillsData?.skills || [];
  const selectedSkillObjects = availableSkills.filter((skill) =>
    selectedSkills.includes(skill.id)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          {isEditing ? "Chỉnh sửa việc làm" : "Tạo việc làm mới"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin cơ bản</h3>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.job_title} *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ví dụ: Frontend Developer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="employment_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{FORM_LABELS.employment_type} *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại hình công việc" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(EMPLOYMENT_TYPES).map(
                            ([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mức kinh nghiệm *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn mức kinh nghiệm" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(EXPERIENCE_LEVELS).map(
                            ([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{FORM_LABELS.job_location}</FormLabel>
                      <FormControl>
                        <Input placeholder="Hà Nội, TP.HCM..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_remote"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>{FORM_LABELS.is_remote}</FormLabel>
                        <FormDescription>
                          Cho phép làm việc từ xa
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Salary Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin lương</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="salary_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{FORM_LABELS.salary_min}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="10000000"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salary_max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{FORM_LABELS.salary_max}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="20000000"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{FORM_LABELS.currency}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="VND">VND</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Mô tả công việc</h3>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.job_description} *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả chi tiết về công việc, trách nhiệm..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.job_requirements}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Yêu cầu về kỹ năng, kinh nghiệm, bằng cấp..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Kỹ năng yêu cầu</h3>

              {selectedSkillObjects.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedSkillObjects.map((skill) => (
                    <Badge key={skill.id} variant="secondary" className="gap-1">
                      {skill.name}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill.id)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <Select onValueChange={addSkill}>
                <SelectTrigger>
                  <SelectValue placeholder="Thêm kỹ năng..." />
                </SelectTrigger>
                <SelectContent>
                  {availableSkills
                    .filter((skill) => !selectedSkills.includes(skill.id))
                    .map((skill) => (
                      <SelectItem key={skill.id} value={skill.id}>
                        {skill.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Trạng thái</h3>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái đăng tin</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full md:w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Lưu nháp</SelectItem>
                        <SelectItem value="published">Đăng ngay</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Bạn có thể lưu nháp và đăng sau hoặc đăng ngay
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !currentUserCompany}
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
                onClick={() => router.back()}
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
