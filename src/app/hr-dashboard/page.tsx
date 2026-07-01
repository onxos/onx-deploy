"use client";

import { api } from "@/trpc/react";

export default function HrDashboardPage() {
  const kpiQuery = api.reporting.listHrKpis.useQuery({});
  const latest = kpiQuery.data?.[0];

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          HR Manager Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          D14-S04 — Headcount, attendance, payroll, and training KPIs
        </p>
      </div>
      <div className="px-6">
        {!kpiQuery.isLoading && !latest && (
          <div className="text-sm text-gray-400">No HR KPI data available</div>
        )}
        {latest && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[
              { label: "Headcount", value: latest.totalHeadcount ?? "—" },
              { label: "Absenteeism %", value: latest.absenteeismRate ?? "—" },
              { label: "Overtime Hours", value: latest.overtimeHours ?? "—" },
              { label: "Open Vacancies", value: latest.openVacancies ?? "—" },
              { label: "Training Hours", value: latest.trainingHours ?? "—" },
              {
                label: "Pending Leave",
                value: latest.pendingLeaveRequests ?? "—",
              },
              { label: "Payroll Total", value: latest.payrollTotal ?? "—" },
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
