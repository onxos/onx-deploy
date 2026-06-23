"use client";

import { StatusBadge } from "@/components/ui/status-badge";
import type { TaskStatus } from "@/lib/validations/execution";

const variants: Record<TaskStatus, "default" | "error" | "info" | "success"> = {
  blocked: "error",
  done: "success",
  "in-progress": "info",
  todo: "default",
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <StatusBadge variant={variants[status]}>{status}</StatusBadge>;
}
