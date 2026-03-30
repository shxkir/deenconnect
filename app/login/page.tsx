import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-xl">
      <AuthForm mode="login" />
    </div>
  );
}

