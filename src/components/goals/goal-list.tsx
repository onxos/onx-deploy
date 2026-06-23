"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import type { Goal } from "@/hooks/use-goals";
import { goalProgress } from "@/hooks/use-goals";
import { GoalCard } from "./goal-card";
import { GoalStatusBadge } from "./goal-status-badge";

const columns: ColumnDef<Goal>[] = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "priority", header: "Priority" },
  {
    accessorKey: "status",
    cell: ({ row }) => <GoalStatusBadge status={row.original.status} />,
    header: "Status",
  },
  { accessorKey: "deadline", header: "Deadline" },
  {
    id: "progress",
    cell: ({ row }) => `${goalProgress(row.original.milestones)}%`,
    header: "Progress",
  },
];

export function GoalList({ goals }: { goals: Goal[] }) {
  if (goals.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        Empty state: no goals exist.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={goals}
        enableColumnVisibility={false}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {goals.map((goal) => (
          <GoalCard goal={goal} key={goal.id} />
        ))}
      </div>
    </div>
  );
}
