"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { createEventRecord, updateEventRecord } from "@/lib/firebase/events";
import type { EventFormValues, EventRecord } from "@/types";

const eventFormSchema = z.object({
  title: z.string().min(4, "Title must be at least 4 characters."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  location: z.string().min(4, "Location must be at least 4 characters."),
  area: z.string().min(2, "Area must be at least 2 characters."),
  dateTime: z.string().min(1, "Select a date and time."),
  imageUrl: z
    .union([z.literal(""), z.string().url("Enter a valid image URL.")])
    .optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
});

interface EventFormProps {
  mode: "create" | "edit";
  initialEvent?: EventRecord;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EventForm({
  mode,
  initialEvent,
  onCancel,
  onSuccess,
}: EventFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: initialEvent?.title ?? "",
      description: initialEvent?.description ?? "",
      location: initialEvent?.location ?? "",
      area: initialEvent?.area ?? "",
      dateTime: initialEvent?.dateTime
        ? format(initialEvent.dateTime, "yyyy-MM-dd'T'HH:mm")
        : "",
      imageUrl: initialEvent?.imageUrl ?? "",
      status: initialEvent?.status ?? "pending",
    },
  });

  async function onSubmit(values: EventFormValues) {
    if (!user) {
      setSubmitError("You must be logged in to submit or edit events.");
      return;
    }

    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);

    try {
      const imageUrl = values.imageUrl?.trim() ?? "";
      const imagePath = "";

      if (mode === "create") {
        await createEventRecord({
          title: values.title,
          description: values.description,
          location: values.location,
          area: values.area,
          dateTime: values.dateTime,
          imageUrl,
          imagePath,
          createdBy: user.uid,
        });

        reset({
          title: "",
          description: "",
          location: "",
          area: "",
          dateTime: "",
          imageUrl: "",
          status: "pending",
        });
        setSubmitSuccess("Event submitted successfully and sent for admin review.");
      } else if (initialEvent) {
        await updateEventRecord(initialEvent.id, {
          title: values.title,
          description: values.description,
          location: values.location,
          area: values.area,
          dateTime: values.dateTime,
          imageUrl,
          imagePath,
          status: values.status,
        });

        setSubmitSuccess("Event updated successfully.");
        onSuccess?.();
      }

      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to save the event.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit((values) => onSubmit(values as EventFormValues))}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-cedar">Title</label>
          <Input placeholder="Ramadan community iftar" {...register("title")} />
          {errors.title ? (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          ) : null}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-cedar">Description</label>
          <Textarea
            rows={5}
            placeholder="Share the purpose, program, speakers, and who this event is for."
            {...register("description")}
          />
          {errors.description ? (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-cedar">Location</label>
          <Input placeholder="Lakemba Masjid Hall" {...register("location")} />
          {errors.location ? (
            <p className="text-sm text-red-600">{errors.location.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-cedar">Area</label>
          <Input placeholder="Western Sydney" {...register("area")} />
          {errors.area ? (
            <p className="text-sm text-red-600">{errors.area.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-cedar">Date & time</label>
          <Input type="datetime-local" {...register("dateTime")} />
          {errors.dateTime ? (
            <p className="text-sm text-red-600">{errors.dateTime.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-cedar">
            Event image URL
          </label>
          <Input
            placeholder="https://example.com/event-flyer.jpg"
            {...register("imageUrl")}
          />
          <p className="text-xs text-forest/60">
            Add a public image URL if you have one. Leave blank to use the default event artwork.
          </p>
          {errors.imageUrl ? (
            <p className="text-sm text-red-600">{errors.imageUrl.message}</p>
          ) : null}
        </div>

        {mode === "edit" ? (
          <div className="space-y-2">
            <label className="text-sm font-medium text-cedar">Status</label>
            <Select {...register("status")}>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </Select>
          </div>
        ) : null}
      </div>

      {submitError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      ) : null}

      {submitSuccess ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {submitSuccess}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? mode === "create"
              ? "Submitting..."
              : "Saving..."
            : mode === "create"
              ? "Submit Event"
              : "Save Changes"}
        </Button>
        {onCancel ? (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
