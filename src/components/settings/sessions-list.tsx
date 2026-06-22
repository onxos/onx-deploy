"use client";

import { useState } from "react";

const initialSessions = [
  { id: "s1", label: "Current browser", status: "active" },
  { id: "s2", label: "Mobile session", status: "idle" },
];

export function SessionsList() {
  const [sessions, setSessions] = useState(initialSessions);
  return (
    <section className="rounded-lg border bg-card p-5">
      <h2 className="font-semibold">Active sessions</h2>
      <div className="mt-4 grid gap-3">
        {sessions.map((session) => (
          <div
            className="flex items-center justify-between gap-4 rounded-md border p-3"
            key={session.id}
          >
            <div>
              <p className="font-medium">{session.label}</p>
              <p className="text-sm text-muted-foreground">{session.status}</p>
            </div>
            <button
              className="rounded-md border px-3 py-2 text-sm"
              onClick={() =>
                setSessions((items) =>
                  items.filter((item) => item.id !== session.id),
                )
              }
              type="button"
            >
              Revoke
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
