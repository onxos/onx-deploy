"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import type { Potential } from "@/hooks/use-potential";
import { FeasibilityBadge } from "./feasibility-badge";
import { PotentialCard } from "./potential-card";

const columns: ColumnDef<Potential>[] = [
  { accessorKey: "parentDreamTitle", header: "Parent dream" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "assessmentScore", header: "Assessment" },
  {
    accessorKey: "feasibility",
    cell: ({ row }) => <FeasibilityBadge rating={row.original.feasibility} />,
    header: "Feasibility",
  },
];

export function PotentialList({ potentials }: { potentials: Potential[] }) {
  if (potentials.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        Empty state: no potentials exist.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={potentials}
        enableColumnVisibility={false}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {potentials.map((potential) => (
          <PotentialCard key={potential.id} potential={potential} />
        ))}
      </div>
    </div>
  );
}
