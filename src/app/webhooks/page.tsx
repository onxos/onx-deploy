"use client";

import { api } from "@/trpc/react";

export default function WebhooksPage() {
  const endpointsQuery = api.webhook.listEndpoints.useQuery();

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Webhook Dispatch
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          D13-S07 — Manage webhook endpoints and monitor delivery status
        </p>
      </div>

      <div className="px-6">
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700">
              Webhook Endpoints
            </h2>
            <span className="text-xs text-gray-500">
              {endpointsQuery.data?.length ?? 0} registered
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {endpointsQuery.isLoading && (
              <div className="px-4 py-3 text-sm text-gray-400">Loading…</div>
            )}
            {endpointsQuery.data?.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">
                No webhook endpoints registered
              </div>
            )}
            {endpointsQuery.data?.map((ep) => (
              <div key={ep.id} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {ep.name}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      ep.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {ep.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-500 truncate">
                  {ep.url}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
