import { AuthForm } from "@/components/auth/auth-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="mx-auto max-w-xl">
      <AuthForm mode="login" nextPath={next || "/"} />
    </div>
  );
}
