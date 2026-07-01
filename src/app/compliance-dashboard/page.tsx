"use client";
import { api } from "@/trpc/react";
export default function ComplianceDashboardPage() {
  const kpiQuery = api.reporting.listComplianceKpis.useQuery({});
  const latest = kpiQuery.data?.[0];
  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Compliance &amp; Audit Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          D14-S08 — Audit findings, CAPAs, licences, incidents, and risk KPIs
        </p>
      </div>
      <div className="px-6">
        {!kpiQuery.isLoading && !latest && (
          <div className="text-sm text-gray-400">
            No compliance KPI data available
          </div>
        )}
        {latest && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              {
                label: "Open Audit Findings",
                value: latest.openAuditFindings ?? "—",
              },
              { label: "Overdue CAPAs", value: latest.overdueCapas ?? "—" },
              {
                label: "Expiring Licences",
                value: latest.expiringLicences ?? "—",
              },
              { label: "Open Incidents", value: latest.openIncidents ?? "—" },
              { label: "High Risk Items", value: latest.highRiskItems ?? "—" },
              {
                label: "Policy ACK Rate",
                value: latest.policyAcknowledgementRate ?? "—",
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
