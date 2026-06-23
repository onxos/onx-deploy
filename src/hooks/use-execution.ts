"use client";

import type { Task } from "./use-tasks";

export function useExecution(tasks: Task[]) {
  const today = new Date().toISOString().slice(0, 10);
  const timeline = [...tasks].sort((a, b) =>
    a.dueDate.localeCompare(b.dueDate),
  );
  const stats = {
    blocked: tasks.filter((task) => task.status === "blocked").length,
    completed: tasks.filter((task) => task.status === "done").length,
    inProgress: tasks.filter((task) => task.status === "in-progress").length,
    overdue: tasks.filter(
      (task) => task.dueDate < today && task.status !== "done",
    ).length,
    total: tasks.length,
  };

  return { stats, timeline };
}
