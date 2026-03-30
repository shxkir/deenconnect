import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { getFirebaseClientAuth } from "@/lib/firebase/client";
import { ensureUserProfile } from "@/lib/firebase/users";

export async function signUpWithEmail(input: {
  name: string;
  email: string;
  password: string;
}) {
  const auth = getFirebaseClientAuth();
  const credentials = await createUserWithEmailAndPassword(
    auth,
    input.email,
    input.password,
  );

  await updateProfile(credentials.user, {
    displayName: input.name,
  });

  await ensureUserProfile({
    uid: credentials.user.uid,
    name: input.name,
    email: input.email,
  });

  return credentials.user;
}

export async function signInWithEmail(input: {
  email: string;
  password: string;
}) {
  const auth = getFirebaseClientAuth();
  const credentials = await signInWithEmailAndPassword(
    auth,
    input.email,
    input.password,
  );

  return credentials.user;
}

export async function signOutUser() {
  await signOut(getFirebaseClientAuth());
}

