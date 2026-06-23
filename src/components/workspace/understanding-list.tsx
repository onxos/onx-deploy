"use client";

import type { UnderstandingCardData } from "@/hooks/use-understanding";
import { UnderstandingCard } from "./understanding-card";

export function UnderstandingList({
  items,
}: {
  items: UnderstandingCardData[];
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        Empty state: no understanding cards.
      </div>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <UnderstandingCard item={item} key={item.id} />
      ))}
    </div>
  );
}
