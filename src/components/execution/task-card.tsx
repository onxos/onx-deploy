"use client";

import type { Task } from "@/hooks/use-tasks";
import { TaskStatusBadge } from "./task-status-badge";

export function TaskCard({
  onNextStatus,
  task,
}: {
  onNextStatus?: () => void;
  task: Task;
}) {
  const overdue =
    task.dueDate < new Date().toISOString().slice(0, 10) &&
    task.status !== "done";
  return (
    <article className="rounded-lg border bg-card p-5">
      <div className="flex justify-between gap-4">
        <div>
          <h3 className="font-semibold">{task.title}</h3>
          <p className="text-sm text-muted-foreground">{task.description}</p>
          <p className="mt-2 text-xs">Parent goal: {task.parentGoalTitle}</p>
        </div>
        <TaskStatusBadge status={task.status} />
      </div>
      <p className={overdue ? "mt-3 text-sm text-destructive" : "mt-3 text-sm"}>
        Due date: {task.dueDate} {overdue ? "Overdue warning" : ""}
      </p>
      <button
        className="mt-3 rounded-md border px-3 py-1 text-sm"
        onClick={onNextStatus}
        type="button"
      >
        Status toggle
      </button>
    </article>
  );
}
