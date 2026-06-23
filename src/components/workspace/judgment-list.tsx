"use client";

import type { JudgmentCardData } from "@/hooks/use-judgment";
import { JudgmentCard } from "./judgment-card";

export function JudgmentList({ items }: { items: JudgmentCardData[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        Empty state: no judgment cards.
      </div>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <JudgmentCard item={item} key={item.id} />
      ))}
    </div>
  );
}
