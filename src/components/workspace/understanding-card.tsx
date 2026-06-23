"use client";

import type { UnderstandingCardData } from "@/hooks/use-understanding";

const TYPE_LABELS = {
  analysis: "analysis",
  insight: "insight",
  research: "research",
};

export function UnderstandingCard({ item }: { item: UnderstandingCardData }) {
  return (
    <article className="rounded-lg border bg-card p-5">
      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
        {TYPE_LABELS[item.type]}
      </span>
      <p className="mt-3 text-sm">{item.content}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        Linked {item.linkedEntity.entityType}: {item.linkedEntity.label}
      </p>
      <p className="mt-2 text-xs">Evidence/notes: {item.notes}</p>
    </article>
  );
}
