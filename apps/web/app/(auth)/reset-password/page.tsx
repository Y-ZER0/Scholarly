import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/ui/reset-password/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
