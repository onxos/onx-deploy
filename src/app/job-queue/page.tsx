"use client";
import { api } from "@/trpc/react";
export default function JobQueuePage() {
  const q = api.jobQueue.listJobs.useQuery({ limit: 50 });
  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Background Job Queue
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          D13-S08 — Monitor and manage background job execution across all
          domains
        </p>
      </div>
      <div className="px-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {(
            ["QUEUED", "RUNNING", "COMPLETED", "FAILED", "DEAD_LETTER"] as const
          ).map((s) => (
            <div
              key={s}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {s}
              </div>
              <div className="mt-1 text-xl font-bold text-gray-900">
                {q.data?.filter((j) => j.status === s).length ?? 0}
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-medium text-gray-700">Recent Jobs</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {q.data?.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">No jobs</div>
            )}
            {q.data?.map((j) => (
              <div
                key={j.id}
                className="px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {j.jobType}
                  </span>
                  {j.domain && (
                    <span className="ml-2 text-xs text-gray-500">
                      {j.domain}
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${j.status === "COMPLETED" ? "bg-green-100 text-green-700" : j.status === "FAILED" || j.status === "DEAD_LETTER" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"}`}
                >
                  {j.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
