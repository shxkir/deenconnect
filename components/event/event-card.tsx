import Link from "next/link";
import { MapPin, Users } from "lucide-react";

import { RsvpButton } from "@/components/event/rsvp-button";
import { formatEventDate } from "@/lib/utils";
import type { EventRecord } from "@/types";

interface EventCardProps {
  event: EventRecord;
  attendeeCount: number;
  isRsvped: boolean;
}

export function EventCard({
  event,
  attendeeCount,
  isRsvped,
}: EventCardProps) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/95 shadow-soft">
      <div className="relative h-56 overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-end bg-[radial-gradient(circle_at_top,#efe3b8,transparent_48%),linear-gradient(135deg,#214738,#56715f)] p-6">
            <div className="rounded-3xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mist/80">
                DeenConnect Event
              </p>
              <p className="mt-2 font-serif text-2xl text-white">{event.title}</p>
            </div>
          </div>
        )}
        <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-forest">
          {event.area}
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="space-y-3">
          <p className="text-sm font-medium text-forest/70">
            {formatEventDate(event.dateTime)}
          </p>
          <Link href={`/events/${event.id}`}>
            <h2 className="font-serif text-2xl text-cedar transition hover:text-forest">
              {event.title}
            </h2>
          </Link>
          <p className="line-clamp-3 text-sm leading-6 text-ink/75">
            {event.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-forest/80">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {event.location}
          </span>
          <span className="inline-flex items-center gap-2">
            <Users className="h-4 w-4" />
            {attendeeCount} attending
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/events/${event.id}`}
            className="text-sm font-semibold text-forest hover:text-cedar"
          >
            View details
          </Link>
          <RsvpButton eventId={event.id} isRsvped={isRsvped} />
        </div>
      </div>
    </article>
  );
}
