"use client";

import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { SearchInput } from "@/components/ui/search-input";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<T> {
  title: string;
  description: string;
  data: T[] | undefined;
  isLoading: boolean;
  columns: {
    key: string;
    label: string;
    format?: (value: unknown) => string;
  }[];
  statusField?: string;
  onRefresh: () => void;
  onDelete?: (id: number) => void;
  createForm?: React.ReactNode;
  count?: number;
}

export function DataTable<T extends { id: number; status?: string | null }>({
  title,
  description,
  data,
  isLoading,
  columns,
  statusField = "status",
  onRefresh,
  onDelete,
  createForm,
  count,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = data?.filter((row) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return columns.some((col) => {
      const val = (row as Record<string, unknown>)[col.key];
      return val != null && String(val).toLowerCase().includes(s);
    });
  });

  const getStatusVariant = (
    status: string | null | undefined,
  ): "default" | "success" | "error" | "warning" | "info" => {
    if (!status) return "default";
    const s = status.toLowerCase();
    if (
      [
        "active",
        "resolved",
        "published",
        "completed",
        "approved",
        "healthy",
        "pass",
        "done",
        "closed",
      ].includes(s)
    )
      return "success";
    if (["fail", "rejected", "unhealthy"].includes(s)) return "error";
    if (["draft", "pending", "degraded", "open"].includes(s)) return "warning";
    if (["in_progress", "backlog", "proposed"].includes(s)) return "info";
    return "default";
  };

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            onClick={onRefresh}
            type="button"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          {createForm && (
            <>
              <button
                className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                onClick={() => setDialogOpen(true)}
                type="button"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
              <ModalDialog
                footer={
                  <div className="flex justify-end gap-2">
                    <button
                      className="rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm hover:bg-accent"
                      onClick={() => setDialogOpen(false)}
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                }
                onOpenChange={setDialogOpen}
                open={dialogOpen}
                title={`Create New ${title}`}
              >
                {createForm}
              </ModalDialog>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="max-w-sm flex-1">
          <SearchInput
            onChange={setSearch}
            placeholder="Search..."
            value={search}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {count !== undefined
            ? `${count} total`
            : `${filtered?.length ?? 0} records`}
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              {onDelete && <TableHead className="w-16">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  className="py-8 text-center"
                  colSpan={columns.length + (onDelete ? 1 : 0)}
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered?.length === 0 ? (
              <TableRow>
                <TableCell
                  className="py-8 text-center text-muted-foreground"
                  colSpan={columns.length + (onDelete ? 1 : 0)}
                >
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              filtered?.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => {
                    const val = (row as Record<string, unknown>)[col.key];
                    const display = col.format
                      ? col.format(val)
                      : String(val ?? "-");
                    return (
                      <TableCell key={col.key}>
                        {col.key === statusField && val ? (
                          <StatusBadge variant={getStatusVariant(String(val))}>
                            {String(val)}
                          </StatusBadge>
                        ) : (
                          <span className="text-sm">{display}</span>
                        )}
                      </TableCell>
                    );
                  })}
                  {onDelete && (
                    <TableCell>
                      <button
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                        onClick={() => onDelete(row.id)}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
