"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const getSession = authClient.getSession;
export const signIn = authClient.signIn.email;
export const signOut = authClient.signOut;

export async function refreshSession() {
  return authClient.getSession();
}
