"use client";

import { api } from "@/trpc/react";

export default function AiDecisionsPage() {
  const listQuery = api.aiDecision.list.useQuery({ limit: 50 });

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          AI Decision Endpoints
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          D13-S04 — Placeholder endpoints for future ONX Intelligence (Atlas V6)
          integration
        </p>
      </div>

      <div className="px-6">
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-800">
            These endpoints are stubs. ONX Intelligence consumers will be wired
            at Atlas V6 activation.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700">
              Decision Requests
            </h2>
            <span className="text-xs text-gray-500">
              {listQuery.data?.length ?? 0} total
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {listQuery.isLoading && (
              <div className="px-4 py-3 text-sm text-gray-400">Loading…</div>
            )}
            {listQuery.data?.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">
                No AI decision requests yet
              </div>
            )}
            {listQuery.data?.map((req) => (
              <div
                key={req.id}
                className="px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {req.decisionType}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    {req.domain}
                  </span>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    req.status === "RESOLVED"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
