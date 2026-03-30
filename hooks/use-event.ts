"use client";

import { useEffect, useState } from "react";

import {
  getFirebaseClientApp,
  isFirebaseClientConfigured,
} from "@/lib/firebase/client";
import { listenEventById } from "@/lib/firebase/events";
import type { EventRecord } from "@/types";

export function useEvent(eventId: string) {
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setEvent(null);
      setIsLoading(false);
      return;
    }

    if (!isFirebaseClientConfigured) {
      setError("Firebase client configuration is missing.");
      setIsLoading(false);
      return;
    }

    getFirebaseClientApp();

    const unsubscribe = listenEventById(
      eventId,
      (nextEvent) => {
        setEvent(nextEvent);
        setIsLoading(false);
      },
      (nextError) => {
        setError(nextError.message);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, [eventId]);

  return { event, isLoading, error };
}

