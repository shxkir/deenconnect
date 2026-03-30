import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-xl">
      <AuthForm mode="signup" />
    </div>
  );
}

