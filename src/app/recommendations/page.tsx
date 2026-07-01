"use client";
import { api } from "@/trpc/react";
export default function RecommendationsPage() {
  const pendingQuery = api.recommendation.listPending.useQuery({ limit: 50 });
  const rulesQuery = api.recommendation.listRules.useQuery({});
  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Recommendation Engine
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          D13-S05 — Stub recommendation engine for future ONX Intelligence
          (Atlas V6+) integration
        </p>
      </div>
      <div className="px-6">
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-800">
            Recommendation engine is a stub. Full AI-powered recommendations
            activate at Atlas V6.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Active Rules
            </div>
            <div className="mt-1 text-3xl font-bold text-gray-900">
              {rulesQuery.data?.length ?? 0}
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Pending Recommendations
            </div>
            <div className="mt-1 text-3xl font-bold text-gray-900">
              {pendingQuery.data?.length ?? 0}
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-medium text-gray-700">Rules</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {rulesQuery.data?.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">
                No rules defined
              </div>
            )}
            {rulesQuery.data?.map((r) => (
              <div
                key={r.id}
                className="px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {r.name}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">{r.domain}</span>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.priority === "HIGH" || r.priority === "CRITICAL" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}
                >
                  {r.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
