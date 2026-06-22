"use client";

import { cn } from "@/lib/utils";

const colors = {
  away: "bg-amber-500",
  offline: "bg-muted-foreground",
  online: "bg-emerald-500",
};

export function ActivityIndicator({ status }: { status: keyof typeof colors }) {
  return (
    <span
      className={cn("inline-block h-2.5 w-2.5 rounded-full", colors[status])}
      title={status}
    />
  );
}
