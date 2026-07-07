"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldLogo } from "../icons/AuthIcons";
import { useResetPassword } from "@/features/auth/hooks/useResetPassword";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const resetMutation = useResetPassword();

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) return;
    resetMutation.mutate(
      { token, newPassword: data.password },
      {
        onSuccess: () => {
          setTimeout(() => router.push("/login"), 2000);
        },
      },
    );
  };

  if (!token) {
    return (
      <div className="w-full max-w-[420px]">
        <div className="flex flex-col items-center">
          <ShieldLogo />
        </div>
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <h1 className="text-2xl font-bold text-card-foreground">
            Invalid link
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This reset link is invalid or has expired.
          </p>
          <Link href="/forgot-password">
            <Button className="mt-6 h-11 w-full rounded-lg text-base font-semibold">
              Request a new link
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (resetMutation.isSuccess) {
    return (
      <div className="w-full max-w-[420px]">
        <div className="flex flex-col items-center">
          <ShieldLogo />
        </div>
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
            <CheckCircle2 className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-card-foreground">
            Password reset
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your password has been reset successfully. Redirecting to sign in...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[420px]">
      <div className="flex flex-col items-center">
        <ShieldLogo />
      </div>

      <div className="rounded-xl border border-border bg-card p-8">
        <h1 className="text-2xl font-bold text-card-foreground">
          Reset password
        </h1>
        <p className="mb-6 mt-1 text-sm text-muted-foreground">
          Enter your new password below.
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm text-muted-foreground"
            >
              New Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-10 bg-secondary text-foreground placeholder:text-muted-foreground pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm text-muted-foreground"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                className="h-10 bg-secondary text-foreground placeholder:text-muted-foreground pr-10"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {resetMutation.isError && (
            <p className="text-sm text-destructive">
              {resetMutation.error?.message ||
                "Failed to reset password"}
            </p>
          )}

          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || resetMutation.isPending}
            className="h-11 w-full rounded-lg text-base font-semibold"
          >
            {resetMutation.isPending
              ? "Resetting..."
              : "Reset Password"}
          </Button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 font-semibold text-foreground hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
