"use client";

import { api } from "@/trpc/react";

export default function EventOutboxPage() {
  const pendingQuery = api.eventOutbox.listPending.useQuery({ limit: 50 });
  const jobsQuery = api.eventOutbox.listJobs.useQuery({ limit: 50 });

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">Event Outbox</h1>
        <p className="mt-1 text-sm text-gray-500">
          D13-S01 — Intelligence &amp; Automation: Domain event publication and
          job queue monitoring
        </p>
      </div>

      <div className="px-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Pending Events
            </div>
            <div className="mt-1 text-3xl font-bold text-gray-900">
              {pendingQuery.isLoading ? "…" : (pendingQuery.data?.length ?? 0)}
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Job Queue
            </div>
            <div className="mt-1 text-3xl font-bold text-gray-900">
              {jobsQuery.isLoading ? "…" : (jobsQuery.data?.length ?? 0)}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-medium text-gray-700">
              Pending Domain Events
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {pendingQuery.isLoading && (
              <div className="px-4 py-3 text-sm text-gray-400">Loading…</div>
            )}
            {pendingQuery.data?.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">
                No pending events
              </div>
            )}
            {pendingQuery.data?.map((ev) => (
              <div
                key={ev.id}
                className="px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {ev.eventType}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    {ev.domain} / {ev.aggregateType}#{ev.aggregateId}
                  </span>
                </div>
                <span className="text-xs text-amber-600 font-medium">
                  {ev.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
