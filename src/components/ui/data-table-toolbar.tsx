"use client";

import type { Table } from "@tanstack/react-table";
import { DataTableViewOptions } from "./data-table-view-options";

export function DataTableToolbar<TData>({
  table,
  children,
  placeholder = "Search...",
}: {
  table: Table<TData>;
  children?: React.ReactNode;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <input
        aria-label="Filter rows"
        className="h-10 w-full rounded-md border bg-background px-3 text-sm sm:max-w-xs"
        onChange={(event) => table.setGlobalFilter(event.target.value)}
        placeholder={placeholder}
        value={(table.getState().globalFilter as string | undefined) ?? ""}
      />
      <div className="flex items-center gap-2">
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
