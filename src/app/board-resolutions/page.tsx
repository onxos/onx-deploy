"use client";
import { api } from "@/trpc/react";
export default function BoardResolutionsPage() {
  const q = api.executiveGov.listResolutions.useQuery({});
  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Board Resolution Register
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          D01-S03 — Board and executive resolutions with adoption tracking
        </p>
      </div>
      <div className="px-6">
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700">Resolutions</h2>
            <span className="text-xs text-gray-500">
              {q.data?.length ?? 0} records
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {q.isLoading && (
              <div className="px-4 py-3 text-sm text-gray-400">Loading…</div>
            )}
            {q.data?.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">
                No resolutions
              </div>
            )}
            {q.data?.map((r) => (
              <div key={r.id} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-gray-500">
                      {r.resolutionNo}
                    </span>
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {r.title}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {r.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {r.summary.slice(0, 100)}
                  {r.summary.length > 100 ? "…" : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
