import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AUTH_COOKIE_NAME, ADMIN_EMAIL } from "@/lib/constants";
import {
  getFirebaseAdminAuth,
  isFirebaseAdminConfigured,
} from "@/lib/firebase/admin";

export interface ServerAuthContext {
  uid: string;
  email: string | null;
  isAdmin: boolean;
}

export async function getServerAuthContext() {
  if (!isFirebaseAdminConfigured) {
    return null;
  }

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    const decodedToken = await getFirebaseAdminAuth().verifyIdToken(
      sessionToken,
    );

    return {
      uid: decodedToken.uid,
      email: decodedToken.email ?? null,
      isAdmin: decodedToken.email === ADMIN_EMAIL,
    } satisfies ServerAuthContext;
  } catch {
    return null;
  }
}

export async function requireServerAuth(nextPath: string) {
  const authContext = await getServerAuthContext();

  if (!authContext) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  return authContext;
}

export async function requireAdminAuth() {
  const authContext = await requireServerAuth("/admin");

  if (!authContext.isAdmin) {
    redirect("/");
  }

  return authContext;
}

