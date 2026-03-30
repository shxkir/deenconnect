import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { RSVP_COLLECTION } from "@/lib/constants";
import { getFirebaseClientDb } from "@/lib/firebase/client";
import type { RsvpRecord } from "@/types";

function mapRsvpRecord(id: string, data: Record<string, unknown>): RsvpRecord {
  return {
    id,
    eventId: (data.eventId as string) ?? "",
    userId: (data.userId as string) ?? "",
    createdAt:
      data.createdAt && typeof data.createdAt === "object" && "toDate" in data.createdAt
        ? (data.createdAt as { toDate: () => Date }).toDate()
        : null,
  };
}

export function buildRsvpId(eventId: string, userId: string) {
  return `${eventId}_${userId}`;
}

export async function setRsvpStatus(input: {
  eventId: string;
  userId: string;
  shouldRsvp: boolean;
}) {
  const db = getFirebaseClientDb();
  const rsvpId = buildRsvpId(input.eventId, input.userId);
  const rsvpRef = doc(db, RSVP_COLLECTION, rsvpId);

  if (input.shouldRsvp) {
    await setDoc(rsvpRef, {
      id: rsvpId,
      eventId: input.eventId,
      userId: input.userId,
      createdAt: serverTimestamp(),
    });
    return;
  }

  await deleteDoc(rsvpRef);
}

export function listenUserRsvps(
  userId: string,
  onData: (rsvps: RsvpRecord[]) => void,
  onError?: (error: Error) => void,
) {
  const db = getFirebaseClientDb();
  const rsvpQuery = query(
    collection(db, RSVP_COLLECTION),
    where("userId", "==", userId),
  );

  return onSnapshot(
    rsvpQuery,
    (snapshot) => {
      onData(snapshot.docs.map((docSnapshot) => mapRsvpRecord(docSnapshot.id, docSnapshot.data())));
    },
    (error) => onError?.(error),
  );
}

