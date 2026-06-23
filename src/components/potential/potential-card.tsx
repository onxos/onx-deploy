"use client";

import Link from "next/link";
import type { Potential } from "@/hooks/use-potential";
import { FeasibilityBadge } from "./feasibility-badge";

export function PotentialCard({ potential }: { potential: Potential }) {
  return (
    <Link
      className="block rounded-lg border bg-card p-5"
      href={`/potential/${potential.id}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold">{potential.category} pathway</h3>
          <p className="text-sm text-muted-foreground">
            {potential.description}
          </p>
          <p className="mt-2 text-xs">
            Parent dream: {potential.parentDreamTitle}
          </p>
        </div>
        <FeasibilityBadge rating={potential.feasibility} />
      </div>
      <p className="mt-4 text-sm font-medium">
        Assessment score: {potential.assessmentScore}/100
      </p>
    </Link>
  );
}
