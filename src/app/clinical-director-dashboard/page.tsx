"use client";

import { api } from "@/trpc/react";

export default function ClinicalDirectorDashboardPage() {
  const kpiQuery = api.reporting.listClinicalDirectorKpis.useQuery({});
  const latest = kpiQuery.data?.[0];

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Clinical Director Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          D14-S05 — Consultations, surgeries, lab turnaround, and clinical
          quality KPIs
        </p>
      </div>
      <div className="px-6">
        {!kpiQuery.isLoading && !latest && (
          <div className="text-sm text-gray-400">
            No clinical KPI data available
          </div>
        )}
        {latest && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[
              {
                label: "Consultations",
                value: latest.totalConsultations ?? "—",
              },
              { label: "Surgeries", value: latest.totalSurgeries ?? "—" },
              {
                label: "Avg Consult (min)",
                value: latest.avgConsultationMinutes ?? "—",
              },
              {
                label: "Readmission Rate",
                value: latest.readmissionRate ?? "—",
              },
              {
                label: "Lab TAT (hrs)",
                value: latest.labTurnaroundHours ?? "—",
              },
              { label: "Vaccinations", value: latest.vaccinationCount ?? "—" },
              {
                label: "Prescriptions",
                value: latest.prescriptionCount ?? "—",
              },
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
