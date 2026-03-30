"use client";

import { useEffect, useState } from "react";

import {
  getFirebaseClientApp,
  isFirebaseClientConfigured,
} from "@/lib/firebase/client";
import { listenAllEvents } from "@/lib/firebase/events";
import type { EventRecord } from "@/types";

export function useAllEvents() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseClientConfigured) {
      setError("Firebase client configuration is missing.");
      setIsLoading(false);
      return;
    }

    getFirebaseClientApp();

    const unsubscribe = listenAllEvents(
      (nextEvents) => {
        setEvents(nextEvents);
        setIsLoading(false);
      },
      (nextError) => {
        setError(nextError.message);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  return { events, isLoading, error };
}

