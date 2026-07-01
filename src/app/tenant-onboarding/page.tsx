"use client";
import { useState } from "react";
import { api } from "@/trpc/react";
export default function TenantOnboardingPage() {
  const [tenantId, setTenantId] = useState("tenant-001");
  const q = api.executiveGov.listOnboardingSteps.useQuery({ tenantId });
  const complete = q.data?.filter((s) => s.status === "COMPLETE").length ?? 0;
  const total = q.data?.length ?? 0;
  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Tenant Onboarding
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          D15-S10 — Track onboarding progress for new tenants
        </p>
      </div>
      <div className="px-6">
        <div className="flex items-center gap-3 mb-4">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="tenant-id-input"
          >
            Tenant ID
          </label>
          <input
            id="tenant-id-input"
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
          />
        </div>
        {total > 0 && (
          <div className="mb-4 text-sm text-gray-600">
            {complete}/{total} steps complete (
            {Math.round((complete / total) * 100)}%)
          </div>
        )}
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-medium text-gray-700">
              Onboarding Steps
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {q.data?.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">
                No steps for this tenant
              </div>
            )}
            {(q.data ?? []).map(
              (s: { id: number; step: string; status: string }) => (
                <div
                  key={s.id}
                  className="px-4 py-3 flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {s.step}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.status === "COMPLETE" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    {s.status}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
