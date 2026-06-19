"use client";

import { api } from "@/trpc/react";

export function AiQueryMetrics() {
  const { data } = api.analytics.getAiQueryMetrics.useQuery();

  return (
    <section className="rounded border bg-white p-4">
      <h3 className="font-bold text-[#1e2d3d]">AI Query Metrics</h3>
      <div className="mt-3 space-y-2">
        {(data?.titanInteractions ?? []).map((item) => (
          <div key={item.titanId} className="rounded bg-[#faf9f5] p-2 text-sm">
            {item.titanId}: {item.count}
          </div>
        ))}
      </div>
    </section>
  );
}
