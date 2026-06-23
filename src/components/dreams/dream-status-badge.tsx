"use client";

import { StatusBadge } from "@/components/ui/status-badge";
import type { DreamStatus } from "@/hooks/use-dreams";

const STATUS_VARIANTS: Record<DreamStatus, "default" | "success" | "warning"> =
  {
    Active: "success",
    Archived: "default",
    Draft: "warning",
  };

export function DreamStatusBadge({ status }: { status: DreamStatus }) {
  return <StatusBadge variant={STATUS_VARIANTS[status]}>{status}</StatusBadge>;
}
