"use client";

import { useState } from "react";
import { api } from "@/trpc/react";

export default function TelemetryPage() {
  const [module, setModule] = useState("clinical");
  const metricsQuery = api.telemetry.listByModule.useQuery({
    module,
    limit: 50,
  });

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Module Telemetry
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          D13-S03 — Collect and monitor per-module performance metrics
        </p>
      </div>

      <div className="px-6">
        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm font-medium text-gray-700" htmlFor="module">
            Module
          </label>
          <select
            id="module"
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
            value={module}
            onChange={(e) => setModule(e.target.value)}
          >
            {[
              "clinical",
              "hr",
              "finance",
              "pos",
              "inventory",
              "procurement",
              "insurance",
              "crm",
              "compliance",
            ].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-medium text-gray-700">
              Telemetry Events — {module}
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {metricsQuery.isLoading && (
              <div className="px-4 py-3 text-sm text-gray-400">Loading…</div>
            )}
            {metricsQuery.data?.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">
                No telemetry events for this module
              </div>
            )}
            {metricsQuery.data?.map((ev) => (
              <div
                key={ev.id}
                className="px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {ev.metricName}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">{ev.unit}</span>
                </div>
                <span className="text-sm font-mono text-blue-600">
                  {ev.metricValue}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
