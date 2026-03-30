import "server-only";

const adminConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
};

export const isFirebaseAdminConfigured = Object.values(adminConfig).every(
  Boolean,
);

interface VerifiedFirebaseUser {
  uid: string;
  email: string | null;
}

function assertAdminConfig() {
  const missingKeys = Object.entries(adminConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing Firebase server auth environment variables: ${missingKeys.join(", ")}`,
    );
  }
}

async function verifyIdToken(idToken: string): Promise<VerifiedFirebaseUser> {
  assertAdminConfig();

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${adminConfig.apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
      cache: "no-store",
    },
  );

  const payload = (await response.json()) as {
    users?: Array<{
      localId?: string;
      email?: string;
    }>;
    error?: {
      message?: string;
    };
  };

  const user = payload.users?.[0];

  if (!response.ok || !user?.localId) {
    throw new Error(payload.error?.message || "Invalid Firebase session token.");
  }

  return {
    uid: user.localId,
    email: user.email ?? null,
  };
}

export async function getFirebaseAdminAuth() {
  return {
    verifyIdToken,
  };
}
