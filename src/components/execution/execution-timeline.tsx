"use client";

import type { Task } from "@/hooks/use-tasks";

export function ExecutionTimeline({ tasks }: { tasks: Task[] }) {
  return (
    <section className="rounded-lg border bg-card p-5">
      <h2 className="font-semibold">Timeline view</h2>
      <ol className="mt-4 space-y-3">
        {tasks.map((task) => (
          <li className="border-l-2 border-primary pl-4 text-sm" key={task.id}>
            <span className="font-medium">{task.dueDate}</span> - {task.title}
          </li>
        ))}
      </ol>
    </section>
  );
}
