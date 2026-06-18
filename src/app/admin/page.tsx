"use client";

import AnalyticsView from "@/components/admin/analytics-view";
import GapManager from "@/components/admin/gap-manager";
import SechManager from "@/components/admin/sech-manager";
import { api } from "@/trpc/react";

export default function AdminPage() {
  const { data: stats } = api.admin.getSystemStats.useQuery();

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1e2d3d]">
          Civilization Dashboard
        </h2>
        <p className="mt-2 text-sm text-[#5a6c7d]">
          Live administrative view for ONX knowledge, SECH, gap closure, and
          civilizational pulse.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {[
          ["Knowledge Articles", stats?.articles ?? 0],
          ["Titans", stats?.titans ?? 0],
          ["Gap Items", stats?.gaps ?? 0],
          ["SECH Logs", stats?.sechStatusLogs ?? 0],
        ].map(([label, value]) => (
          <div key={label} className="rounded border bg-white p-4">
            <p className="text-xs font-semibold uppercase text-[#5a6c7d]">
              {label}
            </p>
            <p className="mt-2 text-2xl font-bold text-[#1e2d3d]">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SechManager />
        <GapManager />
      </div>

      <AnalyticsView />
    </section>
  );
}
