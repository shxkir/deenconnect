import { EventForm } from "@/components/forms/event-form";
import { requireServerAuth } from "@/lib/server-auth";

export default async function SubmitPage() {
  await requireServerAuth("/submit");

  return (
    <div className="mx-auto max-w-4xl space-y-6 rounded-[2.5rem] border border-white/70 bg-white/95 p-8 shadow-soft lg:p-10">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-forest/60">
          Submit a new event
        </p>
        <h1 className="font-serif text-4xl text-cedar">
          Share a Muslim community gathering
        </h1>
        <p className="text-sm leading-7 text-forest/70">
          All submissions are stored in Firebase and enter the moderation queue
          as pending until an admin approves them.
        </p>
      </div>

      <EventForm mode="create" />
    </div>
  );
}

