"use client";

import type { Header } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { TableHead } from "./table";

export function DataTableColumnHeader<TData, TValue>({
  header,
}: {
  header: Header<TData, TValue>;
}) {
  const canSort = header.column.getCanSort();
  const sort = header.column.getIsSorted();

  return (
    <TableHead>
      {header.isPlaceholder ? null : (
        <button
          aria-label={`Sort ${header.column.id}`}
          className={cn(
            "inline-flex items-center gap-2 rounded-md text-left",
            canSort && "cursor-pointer hover:text-foreground",
          )}
          disabled={!canSort}
          onClick={header.column.getToggleSortingHandler()}
          type="button"
        >
          <span>
            {flexRender(header.column.columnDef.header, header.getContext())}
          </span>
          {sort === "asc" ? <span aria-hidden="true">up</span> : null}
          {sort === "desc" ? <span aria-hidden="true">down</span> : null}
        </button>
      )}
    </TableHead>
  );
}
