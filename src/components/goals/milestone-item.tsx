"use client";

import type { Milestone } from "@/lib/validations/goal";

export function MilestoneItem({ milestone }: { milestone: Milestone }) {
  return (
    <li className="flex items-center justify-between rounded-md border p-3 text-sm">
      <label className="flex items-center gap-2">
        <input checked={milestone.completed} readOnly type="checkbox" />
        {milestone.title}
      </label>
      <span className="text-muted-foreground">Due {milestone.dueDate}</span>
    </li>
  );
}
