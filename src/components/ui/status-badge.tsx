"use client";

import { cn } from "@/lib/utils";

const variants = {
  default: "bg-muted text-muted-foreground",
  error: "bg-destructive/10 text-destructive",
  info: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

export function StatusBadge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: keyof typeof variants;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        variants[variant],
      )}
    >
      {children}
    </span>
  );
}
