"use client";
import { api } from "@/trpc/react";
export default function ConsolidatedReportsPage() {
  const configsQuery = api.reporting.listConsolidatedConfigs.useQuery({});
  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Consolidated Reporting
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          D15-S05 — Toggle between consolidated multi-branch and individual
          branch views
        </p>
      </div>
      <div className="px-6">
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-medium text-gray-700">
              Report Configurations
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {configsQuery.isLoading && (
              <div className="px-4 py-3 text-sm text-gray-400">Loading…</div>
            )}
            {configsQuery.data?.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">
                No configurations defined
              </div>
            )}
            {configsQuery.data?.map((cfg) => (
              <div
                key={cfg.id}
                className="px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {cfg.reportType}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    {cfg.consolidationMode}
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-500">
                  {cfg.currencyCode}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
