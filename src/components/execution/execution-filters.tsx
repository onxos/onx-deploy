"use client";

import { type TaskStatus, taskStatuses } from "@/lib/validations/execution";

export function ExecutionFilters({
  setStatus,
  status,
}: {
  setStatus: (status: TaskStatus | "All") => void;
  status: TaskStatus | "All";
}) {
  return (
    <div className="flex flex-wrap gap-2 rounded-lg border bg-card p-4">
      {(["All", ...taskStatuses] as const).map((item) => (
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
