import { LoginForm } from "@/features/auth/ui/login/LoginForm";
import { OAuthHandler } from "@/features/auth/ui/oauth/OAuthHandler";

export default function LoginPage() {
  return (
    <>
      <OAuthHandler />
      <LoginForm />
    </>
  );
}
