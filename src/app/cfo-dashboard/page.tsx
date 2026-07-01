"use client";

import { api } from "@/trpc/react";

export default function CfoDashboardPage() {
  const kpiQuery = api.reporting.listFinanceKpis.useQuery({});

  const latest = kpiQuery.data?.[0];

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          CFO Finance Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          D14-S03 — Financial KPIs: revenue, expenses, AR/AP, and cash position
        </p>
      </div>

      <div className="px-6">
        {kpiQuery.isLoading && (
          <div className="text-sm text-gray-400">Loading KPIs…</div>
        )}
        {!kpiQuery.isLoading && !latest && (
          <div className="text-sm text-gray-400">
            No financial KPI data available yet
          </div>
        )}
        {latest && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              { label: "Total Revenue", value: latest.totalRevenue ?? "—" },
              { label: "Total Expenses", value: latest.totalExpenses ?? "—" },
              { label: "Net Profit", value: latest.netProfit ?? "—" },
              {
                label: "Accounts Receivable",
                value: latest.accountsReceivable ?? "—",
              },
              {
                label: "Accounts Payable",
                value: latest.accountsPayable ?? "—",
              },
              { label: "Cash Balance", value: latest.cashBalance ?? "—" },
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
              Finance KPI History
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {kpiQuery.data?.map((kpi) => (
              <div
                key={kpi.id}
                className="px-4 py-3 flex items-center justify-between"
              >
                <span className="text-sm text-gray-900">{kpi.periodLabel}</span>
                <span className="text-sm font-mono text-green-600">
                  {kpi.totalRevenue ?? "—"}
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
