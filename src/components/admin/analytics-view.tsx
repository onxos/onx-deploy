"use client";

import { api } from "@/trpc/react";

export default function AnalyticsView() {
  const { data: pageViews } = api.analytics.getPageViews.useQuery();
  const { data: searches } = api.analytics.getSearchAnalytics.useQuery();
  const { data: pulse } = api.analytics.getCivilizationPulse.useQuery();

  return (
    <section className="rounded border bg-white p-4">
      <h3 className="font-bold text-[#1e2d3d]">Analytics View</h3>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="rounded border p-3">
          <p className="text-xs font-semibold uppercase text-[#5a6c7d]">
            Total Views
          </p>
          <p className="mt-2 text-2xl font-bold text-[#1e2d3d]">
            {pulse?.totalViews ?? 0}
          </p>
        </div>
        <div className="rounded border p-3">
          <p className="text-xs font-semibold uppercase text-[#5a6c7d]">
            Searches
          </p>
          <p className="mt-2 text-2xl font-bold text-[#1e2d3d]">
            {pulse?.totalSearches ?? 0}
          </p>
        </div>
        <div className="rounded border p-3">
          <p className="text-xs font-semibold uppercase text-[#5a6c7d]">
            Tracked Pages
          </p>
          <p className="mt-2 text-2xl font-bold text-[#1e2d3d]">
            {pageViews?.length ?? 0}
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold text-[#1e2d3d]">Page Views</h4>
          <div className="mt-2 space-y-2">
            {(pageViews ?? []).slice(0, 10).map((item) => (
              <div key={item.page} className="rounded bg-[#faf9f5] p-2 text-sm">
                {item.page}: {item.count}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#1e2d3d]">Searches</h4>
          <div className="mt-2 space-y-2">
            {(searches ?? []).slice(0, 10).map((item) => (
              <div
                key={item.query ?? "empty"}
                className="rounded bg-[#faf9f5] p-2 text-sm"
              >
                {item.query ?? "(empty)"}: {item.count}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
