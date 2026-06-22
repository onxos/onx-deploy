"use client";

import { useState } from "react";

export function NotificationSection() {
  const [preferences, setPreferences] = useState({
    email: true,
    inApp: true,
    push: false,
  });

  return (
    <section className="rounded-lg border bg-card p-5">
      <h2 className="font-semibold">Notification preferences</h2>
      <div className="mt-4 grid gap-3">
        {Object.entries(preferences).map(([key, value]) => (
          <label className="flex items-center justify-between gap-4" key={key}>
            <span className="capitalize">{key} notifications</span>
            <input
              checked={value}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  [key]: event.target.checked,
                }))
              }
              type="checkbox"
            />
          </label>
        ))}
      </div>
    </section>
  );
}
