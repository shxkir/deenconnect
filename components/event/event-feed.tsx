"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";

import { EventCard } from "@/components/event/event-card";
import { EventFilters } from "@/components/event/event-filters";
import { ConfigurationNotice } from "@/components/ui/configuration-notice";
import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { useApprovedEvents } from "@/hooks/use-approved-events";
import { useAuth } from "@/hooks/use-auth";
import { useRsvpCounts } from "@/hooks/use-rsvp-counts";
import { useUserRsvps } from "@/hooks/use-user-rsvps";
import { isFirebaseClientConfigured } from "@/lib/firebase/client";

export function EventFeed() {
  const { events, error, isLoading } = useApprovedEvents();
  const { user } = useAuth();
  const userRsvps = useUserRsvps(user?.uid);
  const rsvpCounts = useRsvpCounts(events.map((event) => event.id));
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [visibleCount, setVisibleCount] = useState(DEFAULT_PAGE_SIZE);
  const deferredSearchTerm = useDeferredValue(searchTerm);

  if (!isFirebaseClientConfigured) {
    return <ConfigurationNotice />;
  }

  const areas = Array.from(new Set(events.map((event) => event.area))).sort();
  const filteredEvents = events.filter((event) => {
    const matchesArea = selectedArea ? event.area === selectedArea : true;
    const matchesSearch = deferredSearchTerm
      ? event.title.toLowerCase().includes(deferredSearchTerm.toLowerCase())
      : true;
    return matchesArea && matchesSearch;
  });
  const visibleEvents = filteredEvents.slice(0, visibleCount);

  return (
    <div className="space-y-8">
      <EventFilters
        areas={areas}
        searchValue={searchTerm}
        selectedArea={selectedArea}
        onSearchChange={setSearchTerm}
        onAreaChange={setSelectedArea}
      />

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-[26rem] animate-pulse rounded-[2rem] bg-white/80"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="rounded-[2rem] border border-white/70 bg-white/95 p-10 text-center shadow-soft">
          <p className="font-serif text-3xl text-cedar">No approved events yet</p>
          <p className="mt-3 text-sm text-forest/70">
            Adjust the filters or be the first to submit a new community event.
          </p>
          <div className="mt-6">
            <Link
              href="/submit"
              className="inline-flex items-center justify-center rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-cedar"
            >
              Submit an Event
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {visibleEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                attendeeCount={rsvpCounts[event.id] ?? 0}
                isRsvped={userRsvps.has(event.id)}
              />
            ))}
          </div>

          {visibleCount < filteredEvents.length ? (
            <div className="flex justify-center">
              <Button
                variant="secondary"
                onClick={() => setVisibleCount((count) => count + DEFAULT_PAGE_SIZE)}
              >
                Load more events
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
