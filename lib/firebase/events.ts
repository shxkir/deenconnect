import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { EVENT_COLLECTION, RSVP_COLLECTION } from "@/lib/constants";
import { getFirebaseClientDb } from "@/lib/firebase/client";
import { fromFirestoreDate } from "@/lib/utils";
import type { EventRecord, EventStatus } from "@/types";

function mapEventRecord(id: string, data: Record<string, unknown>): EventRecord {
  return {
    id,
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    location: (data.location as string) ?? "",
    area: (data.area as string) ?? "",
    dateTime: fromFirestoreDate(data.dateTime as Date | null),
    imageUrl: (data.imageUrl as string) ?? "",
    imagePath: (data.imagePath as string) ?? "",
    createdBy: (data.createdBy as string) ?? "",
    status: ((data.status as EventStatus) ?? "pending") as EventStatus,
    createdAt: fromFirestoreDate(data.createdAt as Date | null),
  };
}

export function listenApprovedEvents(
  onData: (events: EventRecord[]) => void,
  onError?: (error: Error) => void,
) {
  const db = getFirebaseClientDb();
  const eventsQuery = query(
    collection(db, EVENT_COLLECTION),
    where("status", "==", "approved"),
    orderBy("dateTime", "asc"),
  );

  return onSnapshot(
    eventsQuery,
    (snapshot) => {
      onData(snapshot.docs.map((docSnapshot) => mapEventRecord(docSnapshot.id, docSnapshot.data())));
    },
    (error) => onError?.(error),
  );
}

export function listenAllEvents(
  onData: (events: EventRecord[]) => void,
  onError?: (error: Error) => void,
) {
  const db = getFirebaseClientDb();
  const eventsQuery = query(
    collection(db, EVENT_COLLECTION),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(
    eventsQuery,
    (snapshot) => {
      onData(snapshot.docs.map((docSnapshot) => mapEventRecord(docSnapshot.id, docSnapshot.data())));
    },
    (error) => onError?.(error),
  );
}

export function listenEventById(
  eventId: string,
  onData: (event: EventRecord | null) => void,
  onError?: (error: Error) => void,
) {
  const db = getFirebaseClientDb();

  return onSnapshot(
    doc(db, EVENT_COLLECTION, eventId),
    (snapshot) => {
      if (!snapshot.exists()) {
        onData(null);
        return;
      }

      onData(mapEventRecord(snapshot.id, snapshot.data()));
    },
    (error) => onError?.(error),
  );
}

export async function createEventRecord(input: {
  title: string;
  description: string;
  location: string;
  area: string;
  dateTime: string;
  imageUrl: string;
  imagePath: string;
  createdBy: string;
}) {
  const db = getFirebaseClientDb();
  const eventRef = doc(collection(db, EVENT_COLLECTION));

  await setDoc(eventRef, {
    id: eventRef.id,
    title: input.title,
    description: input.description,
    location: input.location,
    area: input.area,
    dateTime: Timestamp.fromDate(new Date(input.dateTime)),
    imageUrl: input.imageUrl,
    imagePath: input.imagePath,
    createdBy: input.createdBy,
    status: "pending",
    createdAt: serverTimestamp(),
  });

  return eventRef.id;
}

export async function updateEventRecord(
  eventId: string,
  input: {
    title: string;
    description: string;
    location: string;
    area: string;
    dateTime: string;
    imageUrl: string;
    imagePath: string;
    status?: EventStatus;
  },
) {
  const db = getFirebaseClientDb();

  await updateDoc(doc(db, EVENT_COLLECTION, eventId), {
    title: input.title,
    description: input.description,
    location: input.location,
    area: input.area,
    dateTime: Timestamp.fromDate(new Date(input.dateTime)),
    imageUrl: input.imageUrl,
    imagePath: input.imagePath,
    ...(input.status ? { status: input.status } : {}),
  });
}

export async function setEventStatus(eventId: string, status: EventStatus) {
  const db = getFirebaseClientDb();
  await updateDoc(doc(db, EVENT_COLLECTION, eventId), { status });
}

export async function getEventById(eventId: string) {
  const db = getFirebaseClientDb();
  const snapshot = await getDoc(doc(db, EVENT_COLLECTION, eventId));

  if (!snapshot.exists()) {
    return null;
  }

  return mapEventRecord(snapshot.id, snapshot.data());
}

export async function deleteEventRecord(event: EventRecord) {
  const db = getFirebaseClientDb();
  const batch = writeBatch(db);
  const rsvpSnapshot = await getDocs(
    query(collection(db, RSVP_COLLECTION), where("eventId", "==", event.id)),
  );

  rsvpSnapshot.forEach((docSnapshot) => {
    batch.delete(docSnapshot.ref);
  });

  batch.delete(doc(db, EVENT_COLLECTION, event.id));
  await batch.commit();
}
