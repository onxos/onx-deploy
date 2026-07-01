"use client";
import { useState } from "react";
import { api } from "@/trpc/react";
export default function BranchConfigPage() {
  const [branchId, setBranchId] = useState("branch-001");
  const q = api.multibranch.listBranchConfigs.useQuery({ branchId });
  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Branch Configuration
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          D15-S07 — Central vs local configuration override per branch
        </p>
      </div>
      <div className="px-6">
        <div className="flex items-center gap-3 mb-4">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="branch-id-input"
          >
            Branch ID
          </label>
          <input
            id="branch-id-input"
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
          />
        </div>
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-medium text-gray-700">
              Config Overrides — {branchId}
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {q.data?.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">
                No overrides for this branch
              </div>
            )}
            {q.data?.map((c) => (
              <div
                key={c.id}
                className="px-4 py-3 flex items-center justify-between"
              >
                <span className="text-sm font-medium text-gray-900">
                  {c.configKey}
                </span>
                <span className="text-sm font-mono text-blue-600 truncate max-w-xs">
                  {c.configValue}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
