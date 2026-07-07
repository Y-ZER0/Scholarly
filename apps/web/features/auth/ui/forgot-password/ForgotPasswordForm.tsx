"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldLogo } from "../icons/AuthIcons";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const forgotMutation = useForgotPassword();

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotMutation.mutate(data.email, {
      onSuccess: () => setSent(true),
    });
  };

  if (sent) {
    return (
      <div className="w-full max-w-[420px]">
        <div className="flex flex-col items-center">
          <ShieldLogo />
        </div>

        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-card-foreground">
            Check your email
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            If an account with that email exists, we&apos;ve sent a password
            reset link.
          </p>
          <Button
            variant="outline"
            className="mt-6 h-11 w-full rounded-lg text-base font-semibold"
            onClick={() => {
              setSent(false);
              forgotMutation.reset();
            }}
          >
            Send again
          </Button>
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

  return (
    <div className="w-full max-w-[420px]">
      <div className="flex flex-col items-center">
        <ShieldLogo />
      </div>

      <div className="rounded-xl border border-border bg-card p-8">
        <h1 className="text-2xl font-bold text-card-foreground">
          Forgot password?
        </h1>
        <p className="mb-6 mt-1 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm text-muted-foreground"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="ben@gmail.com"
              className="h-10 bg-secondary text-foreground placeholder:text-muted-foreground"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          {forgotMutation.isError && (
            <p className="text-sm text-destructive">
              {forgotMutation.error?.message || "Something went wrong"}
            </p>
          )}

          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || forgotMutation.isPending}
            className="h-11 w-full rounded-lg text-base font-semibold"
          >
            {forgotMutation.isPending
              ? "Sending..."
              : "Send Reset Link"}
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
