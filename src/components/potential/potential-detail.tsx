"use client";

import type { Potential } from "@/hooks/use-potential";
import { FeasibilityBadge } from "./feasibility-badge";

export function PotentialDetail({
  onMarkForConversion,
  potential,
}: {
  onMarkForConversion?: () => void;
  potential: Potential;
}) {
  return (
    <article className="rounded-lg border bg-card p-6">
      <div className="flex justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">
            {potential.category} potential
          </h1>
          <p className="mt-2 text-muted-foreground">{potential.description}</p>
        </div>
        <FeasibilityBadge rating={potential.feasibility} />
      </div>
      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt>Parent dream</dt>
          <dd>{potential.parentDreamTitle}</dd>
        </div>
        <div>
          <dt>Assessment score</dt>
          <dd>{potential.assessmentScore}/100</dd>
        </div>
        <div>
          <dt>Conversion ready</dt>
          <dd>{potential.conversionReady ? "Yes" : "No"}</dd>
        </div>
      </dl>
      <button
        className="mt-6 rounded-md border px-4 py-2 text-sm"
        onClick={onMarkForConversion}
        type="button"
      >
        Mark for goal conversion
      </button>
    </article>
  );
}
