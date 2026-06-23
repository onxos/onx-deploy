"use client";

import Link from "next/link";
import type { Dream } from "@/hooks/use-dreams";
import { DreamStatusBadge } from "./dream-status-badge";

const CATEGORY_COLORS: Record<Dream["category"], string> = {
  Creative: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Other: "bg-muted text-muted-foreground",
  Personal: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  Professional: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  Social: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
  Spiritual: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
};

const PRIORITY_COLORS: Record<Dream["priority"], string> = {
  Critical: "bg-red-500",
  High: "bg-orange-500",
  Low: "bg-gray-400",
  Medium: "bg-yellow-500",
};

export function DreamCard({ dream }: { dream: Dream }) {
  const excerpt =
    dream.description.length > 120
      ? `${dream.description.slice(0, 120)}...`
      : dream.description;

  return (
    <Link
      className="block rounded-lg border bg-card p-5 transition hover:border-primary"
      href={`/dreams/${dream.id}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h3 className="font-semibold">{dream.title}</h3>
          <p className="text-sm text-muted-foreground">{excerpt}</p>
        </div>
        <DreamStatusBadge status={dream.status} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span
          className={`rounded-full px-2.5 py-1 ${CATEGORY_COLORS[dream.category]}`}
        >
          {dream.category}
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${PRIORITY_COLORS[dream.priority]}`}
          />
          {dream.priority}
        </span>
      </div>
    </Link>
  );
}
