"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { signOutUser } from "@/lib/firebase/auth";
import { cn } from "@/lib/utils";

const navigationLinks = [
  { href: "/", label: "Events" },
  { href: "/submit", label: "Submit Event" },
];

export function Navbar() {
  const pathname = usePathname();
  const { isAdmin, isLoading, profile, user } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    try {
      setIsSigningOut(true);
      await signOutUser();
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/40 bg-sand/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest text-lg font-bold text-white">
            DC
          </div>
          <div>
            <p className="font-serif text-2xl text-cedar">DeenConnect</p>
            <p className="text-xs uppercase tracking-[0.3em] text-forest/60">
              Muslim Event Network
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                pathname === link.href
                  ? "bg-white text-forest shadow-soft"
                  : "text-forest/75 hover:bg-white/70 hover:text-forest",
              )}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin ? (
            <Link
              href="/admin"
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                pathname === "/admin"
                  ? "bg-white text-forest shadow-soft"
                  : "text-forest/75 hover:bg-white/70 hover:text-forest",
              )}
            >
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-white/70" />
          ) : user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-cedar">
                  {profile?.name || user.displayName || "Member"}
                </p>
                <p className="text-xs text-forest/60">{user.email}</p>
              </div>
              <Button
                variant="secondary"
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                {isSigningOut ? "Signing out..." : "Logout"}
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-forest transition hover:bg-white/70"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-cedar"
              >
                Join
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
