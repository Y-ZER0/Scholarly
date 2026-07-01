import { LoginForm } from "@/features/auth/ui/LoginForm";
import { OAuthHandler } from "@/features/auth/logic/OAuthHandler";

export default function LoginPage() {
  return (
    <>
      <OAuthHandler />
      <LoginForm />
    </>
  );
}
