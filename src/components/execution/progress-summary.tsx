"use client";

import type { useExecution } from "@/hooks/use-execution";

export function ProgressSummary({
  stats,
}: {
  stats: ReturnType<typeof useExecution>["stats"];
}) {
  return (
    <section className="grid gap-3 sm:grid-cols-5">
      {[
        ["Total", stats.total],
        ["Completed", stats.completed],
        ["In progress", stats.inProgress],
        ["Blocked", stats.blocked],
        ["Overdue", stats.overdue],
      ].map(([label, value]) => (
        <div className="rounded-lg border bg-card p-4" key={label}>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      ))}
    </section>
  );
}
