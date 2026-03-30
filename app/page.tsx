import { EventFeed } from "@/components/event/event-feed";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="grid gap-8 rounded-[2.5rem] border border-white/70 bg-hero-radial bg-white/80 p-8 shadow-soft lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
        <div className="space-y-6">
          <div className="inline-flex rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-forest">
            Real-time Muslim events platform
          </div>
          <div className="space-y-4">
            <h1 className="font-serif text-5xl leading-tight text-cedar sm:text-6xl">
              Discover trusted Muslim events across your community.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-ink/75">
              DeenConnect helps communities surface upcoming circles, seminars,
              classes, fundraisers, and family programs, with live RSVP counts
              and admin moderation built on Firebase.
            </p>
          </div>
        </div>
        <div className="grid gap-4 self-end sm:grid-cols-2">
          <div className="rounded-[2rem] bg-white/90 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-forest/60">
              Moderated
            </p>
            <h2 className="mt-3 font-serif text-3xl text-cedar">
              Approved before publishing
            </h2>
          </div>
          <div className="rounded-[2rem] bg-forest p-6 text-white">
            <p className="text-sm uppercase tracking-[0.25em] text-white/70">
              Connected
            </p>
            <h2 className="mt-3 font-serif text-3xl">
              Live RSVP counts and updates
            </h2>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-forest/60">
            Upcoming approved events
          </p>
          <h2 className="font-serif text-4xl text-cedar">
            Explore what is happening next
          </h2>
        </div>
        <EventFeed />
      </section>
    </div>
  );
}

