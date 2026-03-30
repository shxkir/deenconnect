"use client";

import { useState } from "react";
import { format } from "date-fns";

import { EventForm } from "@/components/forms/event-form";
import { Button } from "@/components/ui/button";
import { ConfigurationNotice } from "@/components/ui/configuration-notice";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useAllEvents } from "@/hooks/use-all-events";
import { useRsvpCounts } from "@/hooks/use-rsvp-counts";
import { deleteEventRecord, setEventStatus } from "@/lib/firebase/events";
import { isFirebaseClientConfigured } from "@/lib/firebase/client";
import type { EventRecord, EventStatus } from "@/types";

export function AdminDashboard() {
  const { events, error, isLoading } = useAllEvents();
  const counts = useRsvpCounts(events.map((event) => event.id));
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | EventStatus>("all");
  const [editingEvent, setEditingEvent] = useState<EventRecord | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionTarget, setActionTarget] = useState<string | null>(null);

  if (!isFirebaseClientConfigured) {
    return <ConfigurationNotice />;
  }

  const filteredEvents = events.filter((event) => {
    const matchesStatus = statusFilter === "all" ? true : event.status === statusFilter;
    const normalizedSearch = searchTerm.toLowerCase();
    const matchesSearch = normalizedSearch
      ? [event.title, event.location, event.area]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch)
      : true;
    return matchesStatus && matchesSearch;
  });
  const pendingEvents = events.filter((event) => event.status === "pending");

  async function handleStatusChange(eventId: string, status: EventStatus) {
    try {
      setActionError(null);
      setActionTarget(eventId);
      await setEventStatus(eventId, status);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to update event status.",
      );
    } finally {
      setActionTarget(null);
    }
  }

  async function handleDelete(event: EventRecord) {
    const confirmed = window.confirm(
      `Delete "${event.title}" and all of its RSVPs? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionError(null);
      setActionTarget(event.id);
      await deleteEventRecord(event);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to delete the event.",
      );
    } finally {
      setActionTarget(null);
    }
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/95 p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-forest/60">
            Moderation queue
          </p>
          <h2 className="mt-2 font-serif text-3xl text-cedar">
            {pendingEvents.length} pending review
          </h2>
          <p className="mt-3 text-sm text-forest/70">
            Approve or reject new community event submissions in real time.
          </p>
        </div>

        <div className="grid gap-4 rounded-[2rem] border border-white/70 bg-white/95 p-6 shadow-soft md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-cedar">Search</label>
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search title, location, or area"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-cedar">Status</label>
            <Select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "all" | EventStatus)
              }
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </Select>
          </div>
        </div>
      </section>

      {actionError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      ) : null}

      {isLoading ? (
        <div className="h-80 animate-pulse rounded-[2rem] bg-white/80" />
      ) : error ? (
        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/95 shadow-soft">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-forest/10">
              <thead className="bg-mist/80">
                <tr className="text-left text-xs uppercase tracking-[0.2em] text-forest/60">
                  <th className="px-5 py-4">Event</th>
                  <th className="px-5 py-4">When</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">RSVPs</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest/10 text-sm text-ink/80">
                {filteredEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <p className="font-semibold text-cedar">{event.title}</p>
                        <p className="text-xs text-forest/65">
                          {event.area} • {event.location}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {event.dateTime
                        ? format(event.dateTime, "d MMM yyyy, h:mm a")
                        : "TBC"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-forest">
                        {event.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">{counts[event.id] ?? 0}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {event.status !== "approved" ? (
                          <Button
                            className="px-4 py-2 text-xs"
                            disabled={actionTarget === event.id}
                            onClick={() => handleStatusChange(event.id, "approved")}
                          >
                            Approve
                          </Button>
                        ) : null}
                        {event.status !== "rejected" ? (
                          <Button
                            className="px-4 py-2 text-xs"
                            variant="secondary"
                            disabled={actionTarget === event.id}
                            onClick={() => handleStatusChange(event.id, "rejected")}
                          >
                            Reject
                          </Button>
                        ) : null}
                        <Button
                          className="px-4 py-2 text-xs"
                          variant="ghost"
                          onClick={() => setEditingEvent(event)}
                        >
                          Edit
                        </Button>
                        <Button
                          className="px-4 py-2 text-xs"
                          variant="danger"
                          disabled={actionTarget === event.id}
                          onClick={() => handleDelete(event)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-forest/70">
                      No events match the current filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editingEvent ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/45 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-white/70 bg-white p-8 shadow-soft">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-forest/60">
                  Edit event
                </p>
                <h3 className="font-serif text-3xl text-cedar">
                  {editingEvent.title}
                </h3>
              </div>
              <Button variant="ghost" onClick={() => setEditingEvent(null)}>
                Close
              </Button>
            </div>

            <EventForm
              mode="edit"
              initialEvent={editingEvent}
              onCancel={() => setEditingEvent(null)}
              onSuccess={() => setEditingEvent(null)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

