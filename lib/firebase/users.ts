import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { USER_COLLECTION } from "@/lib/constants";
import { getFirebaseClientDb } from "@/lib/firebase/client";
import { fromFirestoreDate } from "@/lib/utils";
import type { UserProfile } from "@/types";

function mapUserProfile(id: string, data: Record<string, unknown>): UserProfile {
  return {
    id,
    name: (data.name as string) ?? "",
    email: (data.email as string) ?? "",
    createdAt: fromFirestoreDate(data.createdAt as Date | null),
  };
}

export async function ensureUserProfile(input: {
  uid: string;
  name: string;
  email: string;
}) {
  const db = getFirebaseClientDb();
  const userRef = doc(db, USER_COLLECTION, input.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      id: input.uid,
      name: input.name,
      email: input.email,
      createdAt: serverTimestamp(),
    });
  }
}

export async function getUserProfile(uid: string) {
  const db = getFirebaseClientDb();
  const snapshot = await getDoc(doc(db, USER_COLLECTION, uid));

  if (!snapshot.exists()) {
    return null;
  }

  return mapUserProfile(snapshot.id, snapshot.data());
}

