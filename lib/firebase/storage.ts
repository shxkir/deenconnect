import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { getFirebaseClientStorage } from "@/lib/firebase/client";
import { sanitizeFileName } from "@/lib/utils";

export async function uploadEventImage(file: File, userId: string) {
  const filePath = `events/${userId}/${Date.now()}-${sanitizeFileName(file.name)}`;
  const storageRef = ref(getFirebaseClientStorage(), filePath);

  await uploadBytes(storageRef, file, {
    contentType: file.type || "image/jpeg",
  });

  return {
    imageUrl: await getDownloadURL(storageRef),
    imagePath: filePath,
  };
}

export async function deleteEventImage(imagePath: string) {
  if (!imagePath) {
    return;
  }

  await deleteObject(ref(getFirebaseClientStorage(), imagePath));
}

