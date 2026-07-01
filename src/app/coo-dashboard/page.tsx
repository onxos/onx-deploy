"use client";

import { api } from "@/trpc/react";

export default function CooDashboardPage() {
  const kpiQuery = api.reporting.listOpsKpis.useQuery({});

  const latest = kpiQuery.data?.[0];

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          COO Operations Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          D14-S02 — Real-time operational KPIs across clinical, logistics, and
          supply chain
        </p>
      </div>

      <div className="px-6">
        {kpiQuery.isLoading && (
          <div className="text-sm text-gray-400">Loading KPIs…</div>
        )}
        {!kpiQuery.isLoading && !latest && (
          <div className="text-sm text-gray-400">No KPI data available yet</div>
        )}
        {latest && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              {
                label: "Total Appointments",
                value: latest.totalAppointments ?? "—",
              },
              {
                label: "Completed",
                value: latest.completedAppointments ?? "—",
              },
              {
                label: "Emergency Cases",
                value: latest.emergencyCases ?? "—",
              },
              {
                label: "Avg Wait (min)",
                value: latest.avgWaitMinutes ?? "—",
              },
              { label: "Stock Alerts", value: latest.stockAlerts ?? "—" },
              {
                label: "Open POs",
                value: latest.openPurchaseOrders ?? "—",
              },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {kpi.label}
                </div>
                <div className="mt-1 text-2xl font-bold text-gray-900">
                  {kpi.value}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-medium text-gray-700">
              KPI History — Period: {latest?.periodLabel ?? "None"}
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {kpiQuery.data?.map((kpi) => (
              <div
                key={kpi.id}
                className="px-4 py-3 flex items-center justify-between"
              >
                <span className="text-sm text-gray-900">{kpi.periodLabel}</span>
                <span className="text-sm text-gray-500">
                  {kpi.branchId ?? "All Branches"}
                </span>
              </div>
            ))}
            {kpiQuery.data?.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">No records</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
