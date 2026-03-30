"use client";

import Link from "next/link";
import { MapPin, UserCircle2, Users } from "lucide-react";

import { RsvpButton } from "@/components/event/rsvp-button";
import { ConfigurationNotice } from "@/components/ui/configuration-notice";
import { useAuth } from "@/hooks/use-auth";
import { useEvent } from "@/hooks/use-event";
import { useRsvpCounts } from "@/hooks/use-rsvp-counts";
import { useUserRsvps } from "@/hooks/use-user-rsvps";
import { isFirebaseClientConfigured } from "@/lib/firebase/client";
import { formatEventDate } from "@/lib/utils";

export function EventDetail({ eventId }: { eventId: string }) {
  const { event, error, isLoading } = useEvent(eventId);
  const { user } = useAuth();
  const counts = useRsvpCounts(eventId ? [eventId] : []);
  const userRsvps = useUserRsvps(user?.uid);

  if (!isFirebaseClientConfigured) {
    return <ConfigurationNotice />;
  }

  if (isLoading) {
    return <div className="h-[28rem] animate-pulse rounded-[2rem] bg-white/80" />;
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!event || event.status !== "approved") {
    return (
      <div className="rounded-[2rem] border border-white/70 bg-white/95 p-10 text-center shadow-soft">
        <p className="font-serif text-3xl text-cedar">Event unavailable</p>
        <p className="mt-3 text-sm text-forest/70">
          This event is not publicly available right now.
        </p>
        <div className="mt-6">
          <Link href="/" className="font-semibold text-forest hover:text-cedar">
            Return to event feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/95 shadow-soft">
      <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative min-h-[24rem] overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-6 p-8 lg:p-10">
          <div className="space-y-3">
            <span className="inline-flex rounded-full bg-mist px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-forest">
              {event.area}
            </span>
            <h1 className="font-serif text-4xl text-cedar">{event.title}</h1>
            <p className="text-sm font-medium text-forest/70">
              {formatEventDate(event.dateTime)}
            </p>
          </div>

          <p className="leading-7 text-ink/80">{event.description}</p>

          <div className="space-y-3 rounded-[2rem] bg-mist p-5">
            <div className="flex items-start gap-3 text-sm text-forest/85">
              <MapPin className="mt-0.5 h-5 w-5" />
              <div>
                <p className="font-semibold text-cedar">Location</p>
                <p>{event.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm text-forest/85">
              <Users className="mt-0.5 h-5 w-5" />
              <div>
                <p className="font-semibold text-cedar">Attendees</p>
                <p>{counts[event.id] ?? 0} confirmed RSVPs</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm text-forest/85">
              <UserCircle2 className="mt-0.5 h-5 w-5" />
              <div>
                <p className="font-semibold text-cedar">Hosted by</p>
                <p>Community member</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <RsvpButton
              eventId={event.id}
              isRsvped={userRsvps.has(event.id)}
              isApproved={event.status === "approved"}
            />
            <Link href="/" className="text-sm font-semibold text-forest hover:text-cedar">
              Back to all events
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

