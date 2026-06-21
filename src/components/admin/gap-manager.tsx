"use client";

import { useState } from "react";
import { api } from "@/trpc/react";

const gapStatuses = ["deferred", "partial", "in_progress", "closed"] as const;

export default function GapManager() {
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: gaps, refetch } = api.gap.listGaps.useQuery();
  const updateGap = api.gap.updateGap.useMutation();
  const visible =
    statusFilter === "all"
      ? (gaps ?? [])
      : (gaps ?? []).filter((gap) => gap.status === statusFilter);

  return (
    <section className="rounded border bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-bold text-[#1e2d3d]">Gap Manager</h3>
        <select
          aria-label="Filter gaps by status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded border px-3 py-2 text-sm"
        >
          <option value="all">All</option>
          {gapStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4 max-h-[460px] space-y-3 overflow-auto">
        {visible.map((gap) => (
          <div key={gap.id} className="rounded border p-3">
            <p className="font-semibold text-[#1e2d3d]">
              {gap.sbpId}: {gap.title}
            </p>
            <p className="text-xs text-[#5a6c7d]">{gap.category}</p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <select
                aria-label={`Status for ${gap.sbpId}`}
                defaultValue={gap.status}
                onChange={async (event) => {
                  await updateGap.mutateAsync({
                    sbpId: gap.sbpId,
                    status: event.target.value as (typeof gapStatuses)[number],
                    reason: gap.reason ?? undefined,
                    effort: gap.effort ?? undefined,
                    targetGate: gap.targetGate ?? undefined,
                    dependencies: gap.dependencies ?? undefined,
                  });
                  void refetch();
                }}
                className="rounded border px-3 py-2 text-sm"
              >
                {gapStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <input
                aria-label={`Target gate for ${gap.sbpId}`}
                defaultValue={gap.targetGate ?? ""}
                onBlur={async (event) => {
                  await updateGap.mutateAsync({
                    sbpId: gap.sbpId,
                    status: gap.status as (typeof gapStatuses)[number],
                    reason: gap.reason ?? undefined,
                    effort: gap.effort ?? undefined,
                    targetGate: event.target.value || undefined,
                    dependencies: gap.dependencies ?? undefined,
                  });
                  void refetch();
                }}
                className="rounded border px-3 py-2 text-sm"
                placeholder="Target gate"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
