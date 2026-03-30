import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const adminConfig = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
};

export const isFirebaseAdminConfigured = Object.values(adminConfig).every(
  Boolean,
);

function assertAdminConfig() {
  const missingKeys = Object.entries(adminConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing Firebase admin environment variables: ${missingKeys.join(", ")}`,
    );
  }
}

export function getFirebaseAdminApp() {
  assertAdminConfig();

  if (getApps().length > 0) {
    return getApps()[0];
  }

  return initializeApp({
    credential: cert({
      projectId: adminConfig.projectId,
      clientEmail: adminConfig.clientEmail,
      privateKey: adminConfig.privateKey?.replace(/\\n/g, "\n"),
    }),
  });
}

export function getFirebaseAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

