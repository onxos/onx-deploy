"use client";

import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";

export function useDataTable<TData>({
  columns,
  data,
  pagination,
  onPaginationChange,
  rowCount,
  enableRowSelection = false,
}: {
  columns: ColumnDef<TData>[];
  data: TData[];
  pagination?: PaginationState;
  onPaginationChange?: (state: PaginationState) => void;
  rowCount?: number;
  enableRowSelection?: boolean;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [localPagination, setLocalPagination] = useState<PaginationState>(
    pagination ?? { pageIndex: 0, pageSize: 10 },
  );

  return useReactTable({
    columns,
    data,
    enableRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: Boolean(rowCount),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(localPagination) : updater;
      setLocalPagination(next);
      onPaginationChange?.(next);
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    pageCount: rowCount
      ? Math.ceil(rowCount / (pagination?.pageSize ?? localPagination.pageSize))
      : undefined,
    state: {
      columnVisibility,
      globalFilter,
      pagination: pagination ?? localPagination,
      rowSelection,
      sorting,
    },
  });
}
