"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, GraduationCap, Building2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ShieldLogo } from "../icons/AuthIcons";
import { useRegister } from "@/features/auth/hooks/useRegister";

const registerSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  role: z.enum(["student", "teacher"]),
  profilePhoto: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher">("student");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "student",
      profilePhoto: undefined,
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      profilePhoto: data.profilePhoto,
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be under 5MB");
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setUploadError("Only JPEG and PNG files are accepted");
      return;
    }

    setUploadError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
      const response = await fetch(`${apiBase}/uploads/image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      setPhotoPreview(result.url);
      setValue("profilePhoto", result.url);
    } catch {
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px]">
      <div className="flex flex-col items-center">
        <ShieldLogo />
      </div>

      <div className="rounded-xl border border-border bg-card p-8">
        <h1 className="text-2xl font-bold text-card-foreground">Register</h1>
        <p className="mb-6 mt-1 text-sm text-muted-foreground">
          Create an account to get started.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Role <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole("student");
                  setValue("role", "student");
                }}
                className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors ${
                  selectedRole === "student"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary text-muted-foreground hover:border-border/80"
                }`}
              >
                <GraduationCap className="h-6 w-6" />
                <span className="text-sm font-medium">Student</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole("teacher");
                  setValue("role", "teacher");
                }}
                className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors ${
                  selectedRole === "teacher"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary text-muted-foreground hover:border-border/80"
                }`}
              >
                <Building2 className="h-6 w-6" />
                <span className="text-sm font-medium">Teacher</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Profile Photo
            </Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                photoPreview
                  ? "border-border overflow-hidden"
                  : "border-border bg-muted/10 hover:border-primary/50 hover:bg-muted/20"
              } ${uploading ? "pointer-events-none opacity-60" : ""} h-40`}
            >
              {photoPreview ? (
                <div className="relative h-full w-full">
                  <Image
                    src={photoPreview}
                    alt="Profile preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium text-white">
                      Click to change
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="mb-2 h-8 w-8 text-orange-500" />
                  <span className="text-sm font-medium text-orange-500">
                    {uploading ? "Uploading..." : "Click to upload photo"}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">
                    PNG, JPG up to 5MB
                  </span>
                </>
              )}
            </button>
            {uploadError && (
              <p className="text-xs text-destructive">{uploadError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm text-muted-foreground"
            >
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              className="h-10 bg-secondary text-foreground placeholder:text-muted-foreground"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm text-muted-foreground"
            >
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              className="h-10 bg-secondary text-foreground placeholder:text-muted-foreground"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm text-muted-foreground"
            >
              Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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

          {registerMutation.isError && (
            <p className="text-sm text-destructive">
              {registerMutation.error?.message || "Registration failed"}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || uploading || registerMutation.isPending}
            className="h-11 w-full rounded-lg text-base font-semibold"
          >
            {registerMutation.isPending ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-foreground hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
