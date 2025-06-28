"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, User, Building2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { useRegister } from "@/hooks/auth";
import {
  registerSchema,
  type RegisterInput,
} from "@/lib/validations/schemas/auth.schema";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "candidate",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterInput) => {
    try {
      const result = await registerMutation.mutateAsync(data);

      if (result.success) {
        toast.success("Đăng ký thành công!", {
          description: "Vui lòng kiểm tra email để xác thực tài khoản.",
        });
        router.push("/dang-nhap?message=registration-success");
      } else {
        toast.error("Đăng ký thất bại", {
          description: result.error,
        });
      }
    } catch {
      toast.error("Đã có lỗi xảy ra", {
        description: "Vui lòng thử lại sau.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Role Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Bạn là</Label>
        <RadioGroup
          value={selectedRole}
          onValueChange={(value) =>
            register("role").onChange({ target: { value } })
          }
          className="grid grid-cols-2 gap-4"
        >
          <Card
            className={`cursor-pointer transition-all ${
              selectedRole === "candidate"
                ? "ring-2 ring-blue-500 border-blue-200"
                : "hover:border-gray-300"
            }`}
          >
            <CardContent className="flex items-center space-x-3 p-4">
              <RadioGroupItem value="candidate" id="candidate" />
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <Label htmlFor="candidate" className="cursor-pointer">
                  Ứng viên
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              selectedRole === "employer"
                ? "ring-2 ring-blue-500 border-blue-200"
                : "hover:border-gray-300"
            }`}
          >
            <CardContent className="flex items-center space-x-3 p-4">
              <RadioGroupItem value="employer" id="employer" />
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <Label htmlFor="employer" className="cursor-pointer">
                  Nhà tuyển dụng
                </Label>
              </div>
            </CardContent>
          </Card>
        </RadioGroup>
        {errors.role && (
          <p className="text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName">Họ và tên</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Nhập họ và tên của bạn"
          {...register("fullName")}
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
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
            placeholder="Tạo mật khẩu mạnh"
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

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Nhập lại mật khẩu"
            {...register("confirmPassword")}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
      </Button>
    </form>
  );
}
