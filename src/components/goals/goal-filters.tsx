"use client";

import { type GoalStatus, goalStatuses } from "@/lib/validations/goal";

export function GoalFilters({
  setStatus,
  status,
}: {
  setStatus: (status: GoalStatus | "All") => void;
  status: GoalStatus | "All";
}) {
  return (
    <div className="flex flex-wrap gap-2 rounded-lg border bg-card p-4">
      {(["All", ...goalStatuses] as const).map((item) => (
        <button
          className="rounded-full border px-3 py-1 text-sm data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
          data-active={status === item}
          key={item}
          onClick={() => setStatus(item)}
          type="button"
        >
          {item}
        </button>
      ))}
    </div>
  );
}
