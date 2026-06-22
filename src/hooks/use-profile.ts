"use client";

import { useMemo, useState } from "react";

export type ProfileUser = {
  id: string;
  name: string;
  email: string;
  role: "founder" | "admin" | "operator" | "viewer";
  createdAt: Date;
};

const defaultUser: ProfileUser = {
  id: "husam",
  name: "Husam",
  email: "husam@onx.local",
  role: "founder",
  createdAt: new Date("2026-06-01T00:00:00.000Z"),
};

export function useProfile() {
  const [user, setUser] = useState(defaultUser);
  const [isSaving, setIsSaving] = useState(false);
  const session = useMemo(
    () => ({
      device: "Current browser",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      id: "local-session",
      status: "active",
    }),
    [],
  );

  async function updateProfile(values: Pick<ProfileUser, "email" | "name">) {
    setIsSaving(true);
    await Promise.resolve();
    setUser((current) => ({ ...current, ...values }));
    setIsSaving(false);
  }

  return { isSaving, session, updateProfile, user };
}
