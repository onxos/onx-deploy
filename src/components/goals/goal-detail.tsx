"use client";

import type { Goal } from "@/hooks/use-goals";
import { goalProgress } from "@/hooks/use-goals";
import { GoalStatusBadge } from "./goal-status-badge";
import { MilestoneList } from "./milestone-list";
import { ProgressIndicator } from "./progress-indicator";

export function GoalDetail({ goal }: { goal: Goal }) {
  const overdue = goal.deadline < new Date().toISOString().slice(0, 10);
  return (
    <article className="space-y-6 rounded-lg border bg-card p-6">
      <div className="flex justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">{goal.title}</h1>
          <p className="mt-2 text-muted-foreground">{goal.description}</p>
        </div>
        <GoalStatusBadge status={goal.status} />
      </div>
      <ProgressIndicator value={goalProgress(goal.milestones)} />
      <p className={overdue ? "text-destructive" : ""}>
        Deadline: {goal.deadline} {overdue ? "Overdue warning" : ""}
      </p>
      <p>
        Hierarchy: parent {goal.parentGoalTitle ?? "None"} | child goals{" "}
        {goal.childGoals.join(", ") || "None"}
      </p>
      <MilestoneList milestones={goal.milestones} />
    </article>
  );
}
