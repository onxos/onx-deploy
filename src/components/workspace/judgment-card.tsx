"use client";

import type { JudgmentCardData } from "@/hooks/use-judgment";
import { ConfidenceBadge } from "./confidence-badge";

export function JudgmentCard({ item }: { item: JudgmentCardData }) {
  return (
    <article className="rounded-lg border bg-card p-5">
      <div className="flex justify-between gap-4">
        <h3 className="font-semibold">{item.verdict}</h3>
        <ConfidenceBadge confidence={item.confidence} />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{item.rationale}</p>
      <p className="mt-2 text-xs">
        Linked {item.linkedEntity.entityType}: {item.linkedEntity.label}
      </p>
      <p className="mt-2 text-xs">Evidence/notes: {item.evidence}</p>
    </article>
  );
}
