"use client";
import { api } from "@/trpc/react";
export default function ApprovalMatrixPage() {
  const q = api.executiveGov.listApprovalMatrix.useQuery({});
  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Approval Authority Matrix
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          D01-S02 — Define who can approve what, by amount and entity type
        </p>
      </div>
      <div className="px-6">
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700">
              Authority Rules
            </h2>
            <span className="text-xs text-gray-500">
              {q.data?.length ?? 0} rules
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {q.data?.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">
                No rules defined
              </div>
            )}
            {q.data?.map((r) => (
              <div
                key={r.id}
                className="px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {r.entityType}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    {r.requiredRole}
                  </span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${r.isActive === "true" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                >
                  {r.isActive === "true" ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
