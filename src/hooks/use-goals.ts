"use client";

import { useMemo, useState } from "react";
import type { GoalInput, GoalStatus, Milestone } from "@/lib/validations/goal";

export type Goal = GoalInput & {
  childGoals: string[];
  id: string;
  parentGoalTitle?: string;
  sourcePotentialTitle?: string;
};

const initialMilestones: Milestone[] = [
  {
    completed: true,
    dueDate: "2026-06-23",
    id: "m1",
    title: "Model the dream",
  },
  {
    completed: false,
    dueDate: "2026-06-25",
    id: "m2",
    title: "Verify the route",
  },
];

const initialGoals: Goal[] = [
  {
    childGoals: ["Instrument evidence automation"],
    deadline: "2026-06-30",
    description:
      "Convert the Train K dream surface into a complete operating layer.",
    id: "goal-1",
    milestones: initialMilestones,
    potentialId: "potential-1",
    priority: "Critical",
    sourcePotentialTitle: "Ship the Dream Center first",
    status: "Active",
    title: "Close Train K with 50/50 certification",
  },
  {
    childGoals: [],
    deadline: "2026-06-20",
    description: "Create a reusable evidence path for future trains.",
    id: "goal-2",
    milestones: [
      {
        completed: false,
        dueDate: "2026-06-20",
        id: "m3",
        title: "Archive proof",
      },
    ],
    parentGoalId: "goal-1",
    parentGoalTitle: "Close Train K with 50/50 certification",
    priority: "High",
    status: "Paused",
    title: "Instrument evidence automation",
  },
];

export function goalProgress(milestones: Milestone[]) {
  if (milestones.length === 0) return 0;
  return Math.round(
    (milestones.filter((milestone) => milestone.completed).length /
      milestones.length) *
      100,
  );
}

export function useGoals() {
  const [goals, setGoals] = useState(initialGoals);
  const [status, setStatus] = useState<GoalStatus | "All">("All");
  const filteredGoals = useMemo(
    () => goals.filter((goal) => status === "All" || goal.status === status),
    [goals, status],
  );

  function createGoal(input: GoalInput) {
    setGoals((items) => [
      {
        ...input,
        childGoals: [],
        id: `goal-${items.length + 1}`,
        sourcePotentialTitle: input.potentialId
          ? "Potential conversion"
          : undefined,
      },
      ...items,
    ]);
  }

  function updateGoal(id: string, input: Partial<GoalInput>) {
    setGoals((items) =>
      items.map((goal) => (goal.id === id ? { ...goal, ...input } : goal)),
    );
  }

  function updateStatus(id: string, nextStatus: GoalStatus) {
    updateGoal(id, { status: nextStatus });
  }

  function addMilestone(id: string, milestone: Milestone) {
    setGoals((items) =>
      items.map((goal) =>
        goal.id === id
          ? { ...goal, milestones: [...goal.milestones, milestone] }
          : goal,
      ),
    );
  }

  function useGoal(id: string) {
    return goals.find((goal) => goal.id === id) ?? goals[0];
  }

  return {
    addMilestone,
    createGoal,
    filteredGoals,
    goalProgress,
    goals,
    setStatus,
    status,
    updateGoal,
    updateStatus,
    useGoal,
  };
}
