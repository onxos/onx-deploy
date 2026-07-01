"use client";
import { api } from "@/trpc/react";
export default function CustomReportsPage() {
  const reportsQuery = api.reporting.listCustomReports.useQuery({});
  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Custom Report Builder
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          D14-S09 — Build and manage custom reports across all domains
        </p>
      </div>
      <div className="px-6">
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700">Saved Reports</h2>
            <span className="text-xs text-gray-500">
              {reportsQuery.data?.length ?? 0} reports
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {reportsQuery.isLoading && (
              <div className="px-4 py-3 text-sm text-gray-400">Loading…</div>
            )}
            {reportsQuery.data?.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">
                No custom reports saved
              </div>
            )}
            {reportsQuery.data?.map((r) => (
              <div
                key={r.id}
                className="px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {r.name}
                  </span>
                  {r.description && (
                    <p className="text-xs text-gray-500">{r.description}</p>
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${r.isShared === "true" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}
                >
                  {r.isShared === "true" ? "Shared" : "Private"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
