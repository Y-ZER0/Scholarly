"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Eye, EyeOff, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ShieldLogo, GoogleIcon, GitHubIcon } from "../icons/AuthIcons";
import { useLogin } from "@/features/auth/hooks/useLogin";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");
  const loginMutation = useLogin();

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
    });
  };

  const handleGoogleLogin = () => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    window.location.href = `${apiBase}/auth/google`;
  };

  const handleGithubLogin = () => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    window.location.href = `${apiBase}/auth/github`;
  };

  return (
    <div className="w-full max-w-[420px]">
      <div className="flex flex-col items-center">
        <ShieldLogo />
      </div>

      <div className="rounded-xl border border-border bg-card p-8">
        <h1 className="text-2xl font-bold text-card-foreground">Sign in</h1>
        <p className="mb-6 mt-1 text-sm text-muted-foreground">
          Welcome back
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm text-muted-foreground"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="ben@gmail.com"
              className="h-10 bg-secondary text-foreground placeholder:text-muted-foreground"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm text-muted-foreground"
            >
              Password
            </Label>
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

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) =>
                  setValue("rememberMe", checked === true)
                }
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Remember me
              </Label>
            </div>
            <Link
              href="/forgot-password"
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
              <HelpCircle className="h-4 w-4" />
            </Link>
          </div>

          {loginMutation.isError && (
            <p className="text-sm text-destructive">
              {loginMutation.error?.message || "Invalid email or password"}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || loginMutation.isPending}
            className="h-11 w-full rounded-lg text-base font-semibold"
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-sm text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <p className="mb-3 text-sm text-muted-foreground">Sign in using</p>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-10 gap-2"
            onClick={handleGoogleLogin}
          >
            <GoogleIcon />
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 gap-2"
            onClick={handleGithubLogin}
          >
            <GitHubIcon />
            GitHub
          </Button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        No account?{" "}
        <Link
          href="/register"
          className="font-semibold text-foreground hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
