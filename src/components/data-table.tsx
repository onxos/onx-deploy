"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, RefreshCw, Trash2 } from "lucide-react";

interface DataTableProps<T> {
  title: string;
  description: string;
  data: T[] | undefined;
  isLoading: boolean;
  columns: { key: string; label: string; format?: (value: unknown) => string }[];
  statusField?: string;
  statusColors?: Record<string, string>;
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
  statusColors,
  onRefresh,
  onDelete,
  createForm,
  count,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");

  const filtered = data?.filter((row) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return columns.some((col) => {
      const val = (row as Record<string, unknown>)[col.key];
      return val != null && String(val).toLowerCase().includes(s);
    });
  });

  const getStatusColor = (status: string | null | undefined) => {
    if (!status) return "secondary";
    if (statusColors?.[status]) return statusColors[status];
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      open: "bg-blue-100 text-blue-800",
      closed: "bg-gray-100 text-gray-800",
      resolved: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      published: "bg-green-100 text-green-800",
      pending: "bg-orange-100 text-orange-800",
      completed: "bg-green-100 text-green-800",
      in_progress: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      healthy: "bg-green-100 text-green-800",
      degraded: "bg-yellow-100 text-yellow-800",
      unhealthy: "bg-red-100 text-red-800",
      pass: "bg-green-100 text-green-800",
      fail: "bg-red-100 text-red-800",
      done: "bg-green-100 text-green-800",
      backlog: "bg-gray-100 text-gray-800",
      proposed: "bg-purple-100 text-purple-800",
    };
    return colors[status] || "secondary";
  };

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="mr-1 h-4 w-4" />
            Refresh
          </Button>
          {createForm && (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-1 h-4 w-4" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New</DialogTitle>
                </DialogHeader>
                {createForm}
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <p className="text-sm text-muted-foreground">
          {count !== undefined ? `${count} total` : `${filtered?.length ?? 0} records`}
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
                <TableCell colSpan={columns.length + (onDelete ? 1 : 0)} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (onDelete ? 1 : 0)} className="text-center py-8 text-muted-foreground">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              filtered?.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => {
                    const val = (row as Record<string, unknown>)[col.key];
                    const display = col.format ? col.format(val) : String(val ?? "-");
                    return (
                      <TableCell key={col.key}>
                        {col.key === statusField && val ? (
                          <Badge className={getStatusColor(String(val))} variant="secondary">
                            {String(val)}
                          </Badge>
                        ) : (
                          <span className="text-sm">{display}</span>
                        )}
                      </TableCell>
                    );
                  })}
                  {onDelete && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(row.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
