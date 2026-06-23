"use client";

import { GoalDetail } from "@/components/goals/goal-detail";
import { useGoals } from "@/hooks/use-goals";

export default function GoalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const goals = useGoals();
  const goal = goals.useGoal("goal-1");

  void params;

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-8">
      <GoalDetail goal={goal} />
    </main>
  );
}
