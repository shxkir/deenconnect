import { EventDetail } from "@/components/event/event-detail";

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  return <EventDetail eventId={eventId} />;
}

