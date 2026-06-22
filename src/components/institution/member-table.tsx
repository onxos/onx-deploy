"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { InstitutionMember } from "@/hooks/use-institution";
import { ActivityIndicator } from "./activity-indicator";

const columns: ColumnDef<InstitutionMember>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <StatusBadge>{row.original.role}</StatusBadge>,
  },
  {
    accessorKey: "status",
    header: "Activity",
    cell: ({ row }) => (
      <span className="flex items-center gap-2">
        <ActivityIndicator status={row.original.status} />
        {row.original.status}
      </span>
    ),
  },
];

export function MemberTable({
  members,
  onSelect,
}: {
  members: InstitutionMember[];
  onSelect: (member: InstitutionMember) => void;
}) {
  return (
    <div className="space-y-3">
      <DataTable columns={columns} data={members} />
      <div className="grid gap-2">
        {members.map((member) => (
          <button
            className="rounded-md border px-3 py-2 text-left text-sm"
            key={member.id}
            onClick={() => onSelect(member)}
            type="button"
          >
            Open {member.name} drawer
          </button>
        ))}
      </div>
    </div>
  );
}
