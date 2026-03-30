import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@/lib/constants";
import {
  getFirebaseAdminAuth,
  isFirebaseAdminConfigured,
} from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isFirebaseAdminConfigured) {
    return NextResponse.json(
      { error: "Firebase admin environment variables are missing." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as { token?: string };

  if (!body.token) {
    return NextResponse.json({ error: "Missing ID token." }, { status: 400 });
  }

  await getFirebaseAdminAuth().verifyIdToken(body.token);

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, body.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 5,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ ok: true });
}

