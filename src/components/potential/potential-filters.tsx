"use client";

import {
  type FeasibilityRating,
  feasibilityRatings,
} from "@/lib/validations/potential";

export function PotentialFilters({
  category,
  feasibility,
  setCategory,
  setFeasibility,
}: {
  category: string;
  feasibility: FeasibilityRating | "All";
  setCategory: (value: string) => void;
  setFeasibility: (value: FeasibilityRating | "All") => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 rounded-lg border bg-card p-4">
      {(["All", ...feasibilityRatings] as const).map((item) => (
        <button
          className="rounded-full border px-3 py-1 text-sm data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
          data-active={feasibility === item}
          key={item}
          onClick={() => setFeasibility(item)}
          type="button"
        >
          {item}
        </button>
      ))}
      {["All", "Creation", "Learning", "Service"].map((item) => (
        <button
          className="rounded-full border px-3 py-1 text-sm data-[active=true]:bg-secondary"
          data-active={category === item}
          key={item}
          onClick={() => setCategory(item)}
          type="button"
        >
          {item}
        </button>
      ))}
    </div>
  );
}
