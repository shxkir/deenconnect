"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInWithEmail, signUpWithEmail } from "@/lib/firebase/auth";
import type { AuthFormValues } from "@/types";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const signupSchema = loginSchema
  .extend({
    name: z.string().min(2, "Name must be at least 2 characters."),
    confirmPassword: z.string().min(8, "Confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = mode === "signup" ? signupSchema : loginSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(schema as z.ZodType<AuthFormValues>),
  });

  async function onSubmit(values: AuthFormValues) {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      if (mode === "signup") {
        await signUpWithEmail({
          name: values.name ?? "",
          email: values.email,
          password: values.password,
        });
      } else {
        await signInWithEmail({
          email: values.email,
          password: values.password,
        });
      }

      router.replace(nextPath);
      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Authentication failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-white/60 bg-white/95 p-8 shadow-soft">
      <div className="mb-8 space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-forest/60">
          {mode === "signup" ? "Create account" : "Welcome back"}
        </p>
        <h1 className="font-serif text-4xl text-cedar">
          {mode === "signup" ? "Join DeenConnect" : "Sign in to DeenConnect"}
        </h1>
        <p className="text-sm text-forest/70">
          {mode === "signup"
            ? "Create your account to submit events and manage RSVPs."
            : "Log in to RSVP to events and submit new community programs."}
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {mode === "signup" ? (
          <div className="space-y-2">
            <label className="text-sm font-medium text-cedar">Full name</label>
            <Input placeholder="Aisha Rahman" {...register("name")} />
            {errors.name ? (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            ) : null}
          </div>
        ) : null}

        <div className="space-y-2">
          <label className="text-sm font-medium text-cedar">Email</label>
          <Input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-cedar">Password</label>
          <Input
            type="password"
            autoComplete={
              mode === "signup" ? "new-password" : "current-password"
            }
            placeholder="Minimum 8 characters"
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          ) : null}
        </div>

        {mode === "signup" ? (
          <div className="space-y-2">
            <label className="text-sm font-medium text-cedar">
              Confirm password
            </label>
            <Input
              type="password"
              autoComplete="new-password"
              placeholder="Repeat your password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword ? (
              <p className="text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            ) : null}
          </div>
        ) : null}

        {submitError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        ) : null}

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? mode === "signup"
              ? "Creating account..."
              : "Signing in..."
            : mode === "signup"
              ? "Create account"
              : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-forest/70">
        {mode === "signup" ? "Already have an account?" : "Need an account?"}{" "}
        <Link
          href={mode === "signup" ? `/login?next=${nextPath}` : `/signup?next=${nextPath}`}
          className="font-semibold text-forest hover:text-cedar"
        >
          {mode === "signup" ? "Log in" : "Sign up"}
        </Link>
      </p>
    </div>
  );
}
