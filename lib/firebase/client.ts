import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const requiredClientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const optionalClientConfig = {
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const clientConfig = {
  ...requiredClientConfig,
  ...(optionalClientConfig.measurementId
    ? { measurementId: optionalClientConfig.measurementId }
    : {}),
};

export const isFirebaseClientConfigured = Object.values(
  requiredClientConfig,
).every(Boolean);

function assertClientConfig() {
  const missingKeys = Object.entries(requiredClientConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing Firebase client environment variables: ${missingKeys.join(", ")}`,
    );
  }
}

export function getFirebaseClientApp() {
  assertClientConfig();

  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp(clientConfig);
}

export function getFirebaseClientAuth() {
  return getAuth(getFirebaseClientApp());
}

export function getFirebaseClientDb() {
  return getFirestore(getFirebaseClientApp());
}

export function getFirebaseClientStorage() {
  return getStorage(getFirebaseClientApp());
}
