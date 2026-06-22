"use client";

import { cn } from "@/lib/utils";

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
  editor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
  founder:
    "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200",
  operator: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
  viewer: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
};

export function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-1 text-xs font-medium",
        ROLE_COLORS[role] ?? ROLE_COLORS.viewer,
      )}
    >
      {role}
    </span>
  );
}
