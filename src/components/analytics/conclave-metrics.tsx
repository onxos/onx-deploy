"use client";

import { api } from "@/trpc/react";

export function ConclaveMetrics() {
  const { data } = api.analytics.getConclaveMetrics.useQuery();

  return (
    <section className="rounded border bg-white p-4">
      <h3 className="font-bold text-[#1e2d3d]">Conclave Metrics</h3>
      <p className="mt-2 text-2xl font-bold text-[#1e2d3d]">
        {data?.totalConversations ?? 0}
      </p>
      <p className="text-sm text-[#5a6c7d]">Titan conversations recorded</p>
    </section>
  );
}
