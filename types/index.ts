export type EventStatus = "pending" | "approved" | "rejected";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: Date | null;
}

export interface EventRecord {
  id: string;
  title: string;
  description: string;
  location: string;
  area: string;
  dateTime: Date | null;
  imageUrl: string;
  imagePath: string;
  createdBy: string;
  status: EventStatus;
  createdAt: Date | null;
}

export interface RsvpRecord {
  id: string;
  eventId: string;
  userId: string;
  createdAt: Date | null;
}

export interface AuthFormValues {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface EventFormValues {
  title: string;
  description: string;
  location: string;
  area: string;
  dateTime: string;
  status?: EventStatus;
  image?: FileList;
}

