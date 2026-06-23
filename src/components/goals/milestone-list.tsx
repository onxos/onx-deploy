"use client";

import type { Milestone } from "@/lib/validations/goal";
import { MilestoneItem } from "./milestone-item";

export function MilestoneList({ milestones }: { milestones: Milestone[] }) {
  return (
    <section className="space-y-3">
      <h2 className="font-semibold">Milestone list</h2>
      <ul className="space-y-2">
        {milestones.map((milestone) => (
          <MilestoneItem key={milestone.id} milestone={milestone} />
        ))}
      </ul>
    </section>
  );
}
