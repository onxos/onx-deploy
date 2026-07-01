"use client";
import { api } from "@/trpc/react";
export default function IntegrationContractsPage() {
  const q = api.integrationContract.list.useQuery({});
  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Integration Contracts
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          D13-S06 — Stub contracts for future ONX Intelligence integration
          (Atlas V6+)
        </p>
      </div>
      <div className="px-6">
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-800">
            These are stub contracts. Full integration activates at Atlas V6.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700">
              Registered Contracts
            </h2>
            <span className="text-xs text-gray-500">
              {q.data?.length ?? 0} contracts
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {q.data?.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">
                No contracts registered
              </div>
            )}
            {q.data?.map((c) => (
              <div
                key={c.id}
                className="px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {c.contractKey}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    {c.sourceDomain} → {c.targetSystem}
                  </span>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                >
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
