"use client";

import { useMemo, useState } from "react";
import type { TaskInput, TaskStatus } from "@/lib/validations/execution";

export type Task = TaskInput & {
  id: string;
  parentGoalTitle: string;
};

const initialTasks: Task[] = [
  {
    assignee: "Husam",
    description: "Create the required Dream Center route and components.",
    dueDate: "2026-06-23",
    goalId: "goal-1",
    id: "task-1",
    outcome: "Dream Center implementation started.",
    parentGoalTitle: "Close Train K with 50/50 certification",
    priority: "Critical",
    status: "done",
    title: "Ship WP-K-01",
  },
  {
    assignee: "Husam",
    description: "Capture visual, route, build, and test artifacts.",
    dueDate: "2026-06-20",
    goalId: "goal-1",
    id: "task-2",
    parentGoalTitle: "Close Train K with 50/50 certification",
    priority: "High",
    status: "in-progress",
    title: "Assemble Train K evidence",
  },
];

export function useTasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [status, setStatus] = useState<TaskStatus | "All">("All");
  const filteredTasks = useMemo(
    () => tasks.filter((task) => status === "All" || task.status === status),
    [status, tasks],
  );

  function createTask(input: TaskInput) {
    setTasks((items) => [
      {
        ...input,
        id: `task-${items.length + 1}`,
        parentGoalTitle: "Close Train K with 50/50 certification",
      },
      ...items,
    ]);
  }

  function updateTask(id: string, input: Partial<TaskInput>) {
    setTasks((items) =>
      items.map((task) => (task.id === id ? { ...task, ...input } : task)),
    );
  }

  function updateStatus(id: string, nextStatus: TaskStatus) {
    updateTask(id, { status: nextStatus });
  }

  function recordOutcome(id: string, outcome: string) {
    updateTask(id, { outcome, status: "done" });
  }

  return {
    createTask,
    filteredTasks,
    recordOutcome,
    setStatus,
    status,
    tasks,
    updateStatus,
    updateTask,
  };
}
