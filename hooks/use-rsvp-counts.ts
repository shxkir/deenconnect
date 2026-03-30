"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import { RSVP_COLLECTION } from "@/lib/constants";
import { getFirebaseClientDb, isFirebaseClientConfigured } from "@/lib/firebase/client";
import { chunkArray } from "@/lib/utils";

export function useRsvpCounts(eventIds: string[]) {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const uniqueIds = Array.from(new Set(eventIds.filter(Boolean)));

    if (!uniqueIds.length) {
      setCounts({});
      return;
    }

    if (!isFirebaseClientConfigured) {
      setCounts({});
      return;
    }

    const db = getFirebaseClientDb();
    const chunks = chunkArray(uniqueIds, 10);
    const chunkCache: Record<string, number>[] = chunks.map(() => ({}));

    const unsubscribers = chunks.map((chunk, chunkIndex) =>
      onSnapshot(
        query(collection(db, RSVP_COLLECTION), where("eventId", "in", chunk)),
        (snapshot) => {
          const nextChunkCounts = Object.fromEntries(
            chunk.map((eventId) => [eventId, 0]),
          );

          snapshot.docs.forEach((docSnapshot) => {
            const eventId = docSnapshot.data().eventId as string;
            nextChunkCounts[eventId] = (nextChunkCounts[eventId] ?? 0) + 1;
          });

          chunkCache[chunkIndex] = nextChunkCounts;
          setCounts(Object.assign({}, ...chunkCache));
        },
      ),
    );

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [eventIds.join("|")]);

  return counts;
}

