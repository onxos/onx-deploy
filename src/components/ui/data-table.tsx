"use client";

import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { useMemo } from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableSkeleton } from "./data-table-skeleton";
import { DataTableToolbar } from "./data-table-toolbar";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./table";

export function DataTable<TData>({
  columns,
  data,
  pagination,
  onPaginationChange,
  rowCount,
  enableRowSelection,
  enableColumnVisibility = true,
  toolbar,
  isLoading,
}: {
  columns: ColumnDef<TData>[];
  data: TData[];
  pagination?: PaginationState;
  onPaginationChange?: (state: PaginationState) => void;
  rowCount?: number;
  enableRowSelection?: boolean;
  enableColumnVisibility?: boolean;
  toolbar?: React.ReactNode;
  isLoading?: boolean;
}) {
  const tableColumns = useMemo<ColumnDef<TData>[]>(
    () =>
      enableRowSelection
        ? [
            {
              id: "select",
              enableHiding: false,
              enableSorting: false,
              header: ({ table }) => (
                <input
                  aria-label="Select all rows"
                  checked={table.getIsAllPageRowsSelected()}
                  onChange={(event) =>
                    table.toggleAllPageRowsSelected(event.target.checked)
                  }
                  type="checkbox"
                />
              ),
              cell: ({ row }) => (
                <input
                  aria-label="Select row"
                  checked={row.getIsSelected()}
                  onChange={(event) => row.toggleSelected(event.target.checked)}
                  type="checkbox"
                />
              ),
            },
            ...columns,
          ]
        : columns,
    [columns, enableRowSelection],
  );

  const table = useDataTable({
    columns: tableColumns,
    data,
    enableRowSelection,
    onPaginationChange,
    pagination,
    rowCount,
  });

  if (isLoading) {
    return <DataTableSkeleton columns={tableColumns.length} />;
  }

  return (
    <div className="space-y-4">
      {toolbar ??
        (enableColumnVisibility ? <DataTableToolbar table={table} /> : null)}
      <div className="rounded-md border">
        <Table aria-label="Data table">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <DataTableColumnHeader header={header} key={header.id} />
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center text-muted-foreground"
                  colSpan={tableColumns.length}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
