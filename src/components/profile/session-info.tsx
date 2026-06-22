"use client";

import type { useProfile } from "@/hooks/use-profile";

type SessionInfoProps = {
  session: ReturnType<typeof useProfile>["session"];
};

export function SessionInfo({ session }: SessionInfoProps) {
  return (
    <section className="rounded-lg border bg-card p-4 text-card-foreground">
      <h3 className="font-semibold">Current session</h3>
      <dl className="mt-3 grid gap-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Device</dt>
          <dd>{session.device}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Status</dt>
          <dd>{session.status}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Expires</dt>
          <dd>{session.expiresAt.toLocaleDateString()}</dd>
        </div>
      </dl>
    </section>
  );
}
