"use client";

import { StatusBadge } from "@/components/ui/status-badge";
import type { FeasibilityRating } from "@/lib/validations/potential";

const variants: Record<FeasibilityRating, "error" | "success" | "warning"> = {
  High: "success",
  Low: "error",
  Medium: "warning",
};

export function FeasibilityBadge({ rating }: { rating: FeasibilityRating }) {
  return <StatusBadge variant={variants[rating]}>{rating}</StatusBadge>;
}
