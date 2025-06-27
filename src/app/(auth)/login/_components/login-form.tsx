"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useLogin } from "@/hooks/auth";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { FORM_LABELS, NOTIFICATIONS } from "@/constants/labels";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const result = await loginMutation.mutateAsync(data);

      if (result.success) {
        toast.success(NOTIFICATIONS.login_success);

        // Redirect based on role
        const { role } = result.data.user;
        if (role === "admin") {
          router.push("/admin");
        } else if (role === "employer") {
          router.push("/employer");
        } else {
          router.push("/dashboard");
        }
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    autoComplete="current-password"
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

        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          <LogIn className="w-4 h-4 mr-2" />
          {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>

        <div className="text-center text-sm text-slate-600">
          Chưa có tài khoản?{" "}
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto font-semibold text-blue-600"
            onClick={() => router.push("/register")}
          >
            {"Đăng ký"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
