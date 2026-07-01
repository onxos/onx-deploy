"use client";
import { api } from "@/trpc/react";
export default function ExecDashboardPage() {
  const q = api.executiveGov.listExecKpis.useQuery({});
  const latest = q.data?.[0];
  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Executive Command Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          D01-S01 — CEO-level KPIs: revenue, headcount, patients, decisions,
          escalations
        </p>
      </div>
      <div className="px-6">
        {!q.isLoading && !latest && (
          <div className="text-sm text-gray-400">
            No executive KPI data available
          </div>
        )}
        {latest && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              { label: "Total Revenue", value: latest.totalRevenue ?? "—" },
              { label: "Headcount", value: latest.totalHeadcount ?? "—" },
              { label: "Total Patients", value: latest.totalPatients ?? "—" },
              { label: "Open Decisions", value: latest.openDecisions ?? "—" },
              { label: "Escalations", value: latest.escalationCount ?? "—" },
              { label: "OKR Progress %", value: latest.okrProgress ?? "—" },
            ].map((k) => (
              <div
                key={k.label}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {k.label}
                </div>
                <div className="mt-1 text-2xl font-bold text-gray-900">
                  {k.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
