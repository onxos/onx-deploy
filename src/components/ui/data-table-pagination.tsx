"use client";

import type { Table } from "@tanstack/react-table";

export function DataTablePagination<TData>({ table }: { table: Table<TData> }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected. Page{" "}
        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
      </p>
      <div className="flex items-center gap-2">
        <label className="text-sm" htmlFor="table-page-size">
          Rows
        </label>
        <select
          className="h-9 rounded-md border bg-background px-2 text-sm"
          id="table-page-size"
          onChange={(event) => table.setPageSize(Number(event.target.value))}
          value={table.getState().pagination.pageSize}
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <button
          aria-label="Previous page"
          className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
          type="button"
        >
          Prev
        </button>
        <button
          aria-label="Next page"
          className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  );
}
