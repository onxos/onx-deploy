"use client";

import { api } from "@/trpc/react";

export default function InventoryDashboardPage() {
  const kpiQuery = api.reporting.listInventoryKpis.useQuery({});
  const latest = kpiQuery.data?.[0];

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Inventory &amp; Procurement Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          D14-S06 — Stock levels, stockouts, POs, and inventory value KPIs
        </p>
      </div>
      <div className="px-6">
        {!kpiQuery.isLoading && !latest && (
          <div className="text-sm text-gray-400">
            No inventory KPI data available
          </div>
        )}
        {latest && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              { label: "Total SKUs", value: latest.totalSkus ?? "—" },
              { label: "Stockout Items", value: latest.stockoutItems ?? "—" },
              { label: "Expiring Items", value: latest.expiringItems ?? "—" },
              { label: "Pending POs", value: latest.pendingPOs ?? "—" },
              { label: "Inventory Value", value: latest.inventoryValue ?? "—" },
              { label: "Avg Lead Days", value: latest.avgLeadDays ?? "—" },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {kpi.label}
                </div>
                <div className="mt-1 text-xl font-bold text-gray-900">
                  {kpi.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
