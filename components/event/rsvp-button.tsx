"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { setRsvpStatus } from "@/lib/firebase/rsvps";

interface RsvpButtonProps {
  eventId: string;
  isRsvped: boolean;
  isApproved?: boolean;
}

export function RsvpButton({
  eventId,
  isRsvped,
  isApproved = true,
}: RsvpButtonProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isWorking, setIsWorking] = useState(false);

  if (!user) {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(pathname)}`}
        className="inline-flex items-center justify-center rounded-full border border-forest/15 bg-white px-5 py-2.5 text-sm font-semibold text-forest transition hover:border-forest/30 hover:bg-mist"
      >
        Log in to RSVP
      </Link>
    );
  }

  if (!isApproved) {
    return (
      <Button variant="secondary" disabled>
        RSVP unavailable
      </Button>
    );
  }

  const currentUser = user;

  async function handleClick() {
    if (!currentUser) {
      return;
    }

    try {
      setIsWorking(true);
      await setRsvpStatus({
        eventId,
        userId: currentUser.uid,
        shouldRsvp: !isRsvped,
      });
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <Button
      variant={isRsvped ? "secondary" : "primary"}
      onClick={handleClick}
      disabled={isWorking}
    >
      {isWorking ? "Updating..." : isRsvped ? "Cancel RSVP" : "RSVP"}
    </Button>
  );
}
