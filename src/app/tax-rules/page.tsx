"use client";
import { api } from "@/trpc/react";
export default function Page() {
  const q = api.financeExtended.listTaxRules.useQuery({});
  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Tax & VAT Rules
        </h1>
        <p className="mt-1 text-sm text-gray-500">D03-S10</p>
      </div>
      <div className="px-6">
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700">
              Tax & VAT Rules
            </h2>
            <span className="text-xs text-gray-500">
              {q.data?.length ?? 0} records
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {q.isLoading && (
              <div className="px-4 py-3 text-sm text-gray-400">Loading…</div>
            )}
            {!q.isLoading && q.data?.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">No records</div>
            )}
            {(q.data ?? []).map(
              (item: {
                id: number;
                status?: string;
                [key: string]: unknown;
              }) => (
                <div
                  key={item.id}
                  className="px-4 py-3 flex items-center justify-between"
                >
                  <span className="text-sm text-gray-900">
                    {String(
                      Object.values(item).find(
                        (v, i) => i > 0 && typeof v === "string",
                      ) ?? item.id,
                    )}
                  </span>
                  {item.status && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {String(item.status)}
                    </span>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
