"use client";

import { StatusBadge } from "@/components/ui/status-badge";
import type { ConfidenceLevel } from "@/lib/validations/workspace";

const variants: Record<
  ConfidenceLevel,
  "error" | "info" | "success" | "warning"
> = {
  Certain: "info",
  High: "success",
  Low: "error",
  Medium: "warning",
};

export function ConfidenceBadge({
  confidence,
}: {
  confidence: ConfidenceLevel;
}) {
  return <StatusBadge variant={variants[confidence]}>{confidence}</StatusBadge>;
}
