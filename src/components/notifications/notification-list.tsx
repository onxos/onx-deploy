"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { AppNotification } from "@/hooks/use-notifications";

const columns: ColumnDef<AppNotification>[] = [
  { accessorKey: "title", header: "Title" },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <StatusBadge variant={row.original.type}>{row.original.type}</StatusBadge>
    ),
  },
  { accessorKey: "createdAt", header: "Date" },
  {
    accessorKey: "read",
    header: "State",
    cell: ({ row }) => (row.original.read ? "Read" : "Unread"),
  },
];

export function NotificationList({
  notifications,
}: {
  notifications: AppNotification[];
}) {
  return (
    <DataTable columns={columns} data={notifications} enableColumnVisibility />
  );
}
