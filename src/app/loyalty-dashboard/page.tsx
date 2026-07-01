"use client";

import { api } from "@/trpc/react";

export default function LoyaltyDashboardPage() {
  const kpiQuery = api.reporting.listLoyaltyKpis.useQuery({});
  const latest = kpiQuery.data?.[0];

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Customer &amp; Loyalty Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          D14-S07 — Membership, points, NPS, churn, and lifetime value KPIs
        </p>
      </div>
      <div className="px-6">
        {!kpiQuery.isLoading && !latest && (
          <div className="text-sm text-gray-400">
            No loyalty KPI data available
          </div>
        )}
        {latest && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[
              { label: "Active Members", value: latest.activeMembers ?? "—" },
              {
                label: "New Registrations",
                value: latest.newRegistrations ?? "—",
              },
              { label: "Points Issued", value: latest.pointsIssued ?? "—" },
              { label: "Points Redeemed", value: latest.pointsRedeemed ?? "—" },
              { label: "NPS Score", value: latest.npsScore ?? "—" },
              { label: "Churn Rate", value: latest.churnRate ?? "—" },
              { label: "Avg LTV", value: latest.avgLifetimeValue ?? "—" },
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
