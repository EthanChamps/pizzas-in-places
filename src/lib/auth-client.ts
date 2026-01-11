'use client';

import { createAuthClient } from 'better-auth/react';

// Create auth client pointing to Neon Auth
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_NEON_AUTH_URL,
});

// Export commonly used methods and hooks
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;

// Helper to get current session token for API calls
export async function getSessionToken(): Promise<string | null> {
  try {
    const session = await getSession();
    return session.data?.session?.token || null;
  } catch {
    return null;
  }
}
