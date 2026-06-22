"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function DataTableSkeleton({
  columns = 5,
  rows = 8,
}: {
  columns?: number;
  rows?: number;
}) {
  const rowIds = Array.from({ length: rows }, (_, row) => `row-${row}`);
  const columnIds = Array.from(
    { length: columns },
    (_, column) => `column-${column}`,
  );

  return (
    <output aria-label="Loading table" className="block space-y-3">
      {rowIds.map((row) => (
        <div
          className="grid gap-3"
          key={row}
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {columnIds.map((column) => (
            <Skeleton className="h-9" key={column} />
          ))}
        </div>
      ))}
    </output>
  );
}
