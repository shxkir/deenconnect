import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatEventDate(date: Date | null) {
  if (!date) {
    return "Date to be confirmed";
  }

  return format(date, "EEE, d MMM yyyy 'at' h:mm a");
}

export function sanitizeFileName(fileName: string) {
  return fileName.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
}

export function fromFirestoreDate(
  value:
    | Date
    | { toDate?: () => Date }
    | string
    | number
    | null
    | undefined,
) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "object" && typeof value.toDate === "function") {
    return value.toDate();
  }

  if (typeof value !== "string" && typeof value !== "number") {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function chunkArray<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}
