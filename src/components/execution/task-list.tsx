"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import type { Task } from "@/hooks/use-tasks";
import { TaskCard } from "./task-card";
import { TaskStatusBadge } from "./task-status-badge";

const columns: ColumnDef<Task>[] = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "parentGoalTitle", header: "Parent goal" },
  { accessorKey: "priority", header: "Priority" },
  { accessorKey: "dueDate", header: "Due date" },
  {
    accessorKey: "status",
    cell: ({ row }) => <TaskStatusBadge status={row.original.status} />,
    header: "Status",
  },
];

export function TaskList({
  onNextStatus,
  tasks,
}: {
  onNextStatus?: (id: string) => void;
  tasks: Task[];
}) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        Empty state: no tasks exist.
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={tasks}
        enableColumnVisibility={false}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            onNextStatus={() => onNextStatus?.(task.id)}
            task={task}
          />
        ))}
      </div>
    </div>
  );
}
