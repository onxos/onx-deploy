"use client";

import { GoalFilters } from "@/components/goals/goal-filters";
import { GoalForm } from "@/components/goals/goal-form";
import { GoalList } from "@/components/goals/goal-list";
import { useGoals } from "@/hooks/use-goals";

export default function GoalsPage() {
  const goals = useGoals();

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-3xl font-semibold">Goal Realization</h1>
        <p className="text-muted-foreground">
          Convert potential into goals, milestones, deadlines, and hierarchy.
        </p>
      </div>
      <GoalFilters setStatus={goals.setStatus} status={goals.status} />
      <GoalForm
        fromPotential={{
          description: "Prefilled from potential conversion pathway.",
          title: "Converted potential goal",
        }}
        onSubmit={goals.createGoal}
      />
      <GoalList goals={goals.filteredGoals} />
    </main>
  );
}
