"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLogin } from "@/hooks/auth";
import {
  loginSchema,
  type LoginInput,
} from "@/lib/validations/schemas/auth.schema";

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const result = await loginMutation.mutateAsync({
        ...data,
      });

      if (result.success) {
        toast.success("Đăng nhập thành công!");

        // Redirect based on user role or provided redirect URL
        const destination =
          redirectTo || getDashboardRoute(result.data?.user?.role);
        router.push(destination);
        router.refresh();
      } else {
        toast.error("Đăng nhập thất bại", {
          description: result.error,
        });
      }
    } catch {
      toast.error("Đã có lỗi xảy ra", {
        description: "Vui lòng thử lại sau.",
      });
    }
  };

  const getDashboardRoute = (role?: string): string => {
    switch (role) {
      case "admin":
        return "/admin";
      case "employer":
        return "/dashboard/cong-ty";
      case "candidate":
      default:
        return "/dashboard";
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          {...register("email")}
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu của bạn"
            autoComplete="current-password"
            {...register("password")}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
      </div>

      {/* Remember Me */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="remember-me"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
        />
        <Label
          htmlFor="remember-me"
          className="text-sm font-normal cursor-pointer"
        >
          Ghi nhớ đăng nhập
        </Label>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Hoặc</span>
        </div>
      </div>

      {/* Demo accounts for testing */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500 text-center">
          Tài khoản demo để trải nghiệm:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const emailInput = document.getElementById(
                "email"
              ) as HTMLInputElement;
              const passwordInput = document.getElementById(
                "password"
              ) as HTMLInputElement;
              if (emailInput && passwordInput) {
                emailInput.value = "candidate@demo.com";
                passwordInput.value = "demo123456";
              }
            }}
          >
            Ứng viên
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const emailInput = document.getElementById(
                "email"
              ) as HTMLInputElement;
              const passwordInput = document.getElementById(
                "password"
              ) as HTMLInputElement;
              if (emailInput && passwordInput) {
                emailInput.value = "employer@demo.com";
                passwordInput.value = "demo123456";
              }
            }}
          >
            HR
          </Button>
        </div>
      </div>
    </form>
  );
}
