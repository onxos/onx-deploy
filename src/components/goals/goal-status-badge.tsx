"use client";

import { StatusBadge } from "@/components/ui/status-badge";
import type { GoalStatus } from "@/lib/validations/goal";

const variants: Record<GoalStatus, "error" | "info" | "success" | "warning"> = {
  Abandoned: "error",
  Active: "info",
  Completed: "success",
  Paused: "warning",
};

export function GoalStatusBadge({ status }: { status: GoalStatus }) {
  return <StatusBadge variant={variants[status]}>{status}</StatusBadge>;
}
