"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import type { Dream } from "@/hooks/use-dreams";
import { DreamCard } from "./dream-card";
import { DreamStatusBadge } from "./dream-status-badge";

const columns: ColumnDef<Dream>[] = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "priority", header: "Priority" },
  {
    accessorKey: "status",
    cell: ({ row }) => <DreamStatusBadge status={row.original.status} />,
    header: "Status",
  },
  { accessorKey: "createdAt", header: "Created" },
];

export function DreamList({ dreams }: { dreams: Dream[] }) {
  if (dreams.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        Empty state: no dreams captured yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={dreams}
        enableColumnVisibility={false}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {dreams.map((dream) => (
          <DreamCard dream={dream} key={dream.id} />
        ))}
      </div>
    </div>
  );
}
