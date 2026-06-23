"use client";

import type { Dream } from "@/hooks/use-dreams";
import { DreamStatusBadge } from "./dream-status-badge";

export function DreamDetail({
  dream,
  onArchive,
}: {
  dream: Dream;
  onArchive?: () => void;
}) {
  return (
    <article className="rounded-lg border bg-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">{dream.title}</h1>
          <p className="mt-2 text-muted-foreground">{dream.description}</p>
        </div>
        <DreamStatusBadge status={dream.status} />
      </div>
      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Category</dt>
          <dd>{dream.category}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Priority</dt>
          <dd>{dream.priority}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Created</dt>
          <dd>{dream.createdAt}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Last updated</dt>
          <dd>{dream.updatedAt}</dd>
        </div>
      </dl>
      <div className="mt-6 flex gap-2">
        <button className="rounded-md border px-4 py-2 text-sm" type="button">
          Edit dream
        </button>
        <button
          className="rounded-md border px-4 py-2 text-sm"
          onClick={onArchive}
          type="button"
        >
          Archive dream
        </button>
      </div>
    </article>
  );
}
