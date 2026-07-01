"use client";
import { api } from "@/trpc/react";
export default function ReportDistributionPage() {
  const schedulesQuery = api.reporting.listSchedules.useQuery();
  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Scheduled Report Distribution
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          D14-S10 — Schedule and distribute reports to recipients automatically
        </p>
      </div>
      <div className="px-6">
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700">
              Active Schedules
            </h2>
            <span className="text-xs text-gray-500">
              {schedulesQuery.data?.length ?? 0} schedules
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {schedulesQuery.isLoading && (
              <div className="px-4 py-3 text-sm text-gray-400">Loading…</div>
            )}
            {schedulesQuery.data?.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">
                No report schedules configured
              </div>
            )}
            {schedulesQuery.data?.map((s) => (
              <div
                key={s.id}
                className="px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {s.reportType}
                  </span>
                  <span className="ml-2 text-xs font-mono text-gray-500">
                    {s.cronExpression}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{s.format}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${s.isActive === "true" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {s.isActive === "true" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
