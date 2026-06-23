"use client";

import Link from "next/link";
import type { Goal } from "@/hooks/use-goals";
import { goalProgress } from "@/hooks/use-goals";
import { GoalStatusBadge } from "./goal-status-badge";
import { ProgressIndicator } from "./progress-indicator";

export function GoalCard({ goal }: { goal: Goal }) {
  const overdue = goal.deadline < new Date().toISOString().slice(0, 10);
  return (
    <Link
      className="block rounded-lg border bg-card p-5"
      href={`/goals/${goal.id}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold">{goal.title}</h3>
          <p className="text-sm text-muted-foreground">{goal.description}</p>
        </div>
        <GoalStatusBadge status={goal.status} />
      </div>
      <div className="mt-4">
        <ProgressIndicator value={goalProgress(goal.milestones)} />
      </div>
      <p className={overdue ? "mt-3 text-sm text-destructive" : "mt-3 text-sm"}>
        Deadline: {goal.deadline} {overdue ? "Overdue warning" : ""}
      </p>
    </Link>
  );
}
