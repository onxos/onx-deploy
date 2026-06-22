"use client";

import type { Table } from "@tanstack/react-table";

export function DataTableViewOptions<TData>({
  table,
}: {
  table: Table<TData>;
}) {
  return (
    <details className="relative">
      <summary className="cursor-pointer rounded-md border px-3 py-2 text-sm">
        Columns
      </summary>
      <div className="absolute right-0 z-20 mt-2 min-w-44 rounded-md border bg-popover p-2 shadow">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <label
              className="flex items-center gap-2 rounded px-2 py-1.5 text-sm"
              key={column.id}
            >
              <input
                checked={column.getIsVisible()}
                onChange={(event) =>
                  column.toggleVisibility(event.target.checked)
                }
                type="checkbox"
              />
              {column.id}
            </label>
          ))}
      </div>
    </details>
  );
}
