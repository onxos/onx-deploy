"use client";
import { api } from "@/trpc/react";
export default function InterBranchTransfersPage() {
  const q = api.multibranch.listTransfers.useQuery({});
  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Inter-branch Transfers
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          D15-S06 — Manage stock, staff, and equipment transfers between
          branches
        </p>
      </div>
      <div className="px-6">
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700">
              Transfer Requests
            </h2>
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
                No transfers
              </div>
            )}
            {q.data?.map((t) => (
              <div
                key={t.id}
                className="px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {t.referenceNo}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    {t.fromBranchId} → {t.toBranchId}
                  </span>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${t.status === "COMPLETED" ? "bg-green-100 text-green-700" : t.status === "APPROVED" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}
                >
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
