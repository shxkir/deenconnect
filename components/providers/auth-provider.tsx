"use client";

import { onIdTokenChanged, type User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";

import { ADMIN_EMAIL } from "@/lib/constants";
import {
  getFirebaseClientAuth,
  isFirebaseClientConfigured,
} from "@/lib/firebase/client";
import { ensureUserProfile, getUserProfile } from "@/lib/firebase/users";
import type { UserProfile } from "@/types";

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  isAdmin: false,
  isLoading: true,
});

async function syncSessionCookie(token: string | null) {
  try {
    if (!token) {
      await fetch("/api/session", {
        method: "DELETE",
      });
      return;
    }

    await fetch("/api/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
  } catch {
    // Server-side route protection depends on Firebase admin envs, but the
    // client auth flow can still continue if that route is unavailable.
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseClientConfigured) {
      setIsLoading(false);
      return;
    }

    const auth = getFirebaseClientAuth();

    const unsubscribe = onIdTokenChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setProfile(null);
        setIsLoading(false);
        await syncSessionCookie(null);
        return;
      }

      const name =
        nextUser.displayName || nextUser.email?.split("@")[0] || "DeenConnect Member";
      const email = nextUser.email ?? "";

      await ensureUserProfile({
        uid: nextUser.uid,
        name,
        email,
      });

      const nextProfile = await getUserProfile(nextUser.uid);
      setProfile(nextProfile);
      setIsLoading(false);

      const token = await nextUser.getIdToken();
      await syncSessionCookie(token);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin: profile?.email === ADMIN_EMAIL || user?.email === ADMIN_EMAIL,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

