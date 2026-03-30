"use client";

import { useEffect, useState } from "react";

import { isFirebaseClientConfigured } from "@/lib/firebase/client";
import { listenUserRsvps } from "@/lib/firebase/rsvps";

export function useUserRsvps(userId?: string) {
  const [rsvpEventIds, setRsvpEventIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId || !isFirebaseClientConfigured) {
      setRsvpEventIds(new Set());
      return;
    }

    const unsubscribe = listenUserRsvps(userId, (rsvps) => {
      setRsvpEventIds(new Set(rsvps.map((rsvp) => rsvp.eventId)));
    });

    return unsubscribe;
  }, [userId]);

  return rsvpEventIds;
}

