"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  UserPlus,
  Briefcase,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useRegister } from "@/hooks/auth";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { FORM_LABELS, USER_ROLES } from "@/constants/labels";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const registerMutation = useRegister();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      role: "candidate",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      const result = await registerMutation.mutateAsync(data);

      if (result.success) {
        toast.success(
          "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản"
        );
        router.push("/login");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{FORM_LABELS.full_name}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nguyễn Văn A"
                  autoComplete="name"
                />
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
              <FormLabel>{FORM_LABELS.email}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{FORM_LABELS.password}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{FORM_LABELS.confirm_password}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Bạn là ai?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-1 gap-3"
                >
                  <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-slate-50">
                    <RadioGroupItem value="candidate" id="candidate" />
                    <label
                      htmlFor="candidate"
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <UserIcon className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">
                          {USER_ROLES.candidate}
                        </div>
                        <div className="text-sm text-slate-600">
                          Tìm kiếm cơ hội việc làm
                        </div>
                      </div>
                    </label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-slate-50">
                    <RadioGroupItem value="employer" id="employer" />
                    <label
                      htmlFor="employer"
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <Briefcase className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">{USER_ROLES.employer}</div>
                        <div className="text-sm text-slate-600">
                          Đăng tin tuyển dụng
                        </div>
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={registerMutation.isPending}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {registerMutation.isPending
            ? "Đang tạo tài khoản..."
            : "Tạo tài khoản"}
        </Button>

        <div className="text-center text-sm text-slate-600">
          Đã có tài khoản?{" "}
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto font-semibold text-blue-600"
            onClick={() => router.push("/login")}
          >
            {"Đăng nhập"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
