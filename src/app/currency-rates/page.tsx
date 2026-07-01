"use client";
import { api } from "@/trpc/react";
export default function CurrencyRatesPage() {
  const q = api.multibranch.listCurrencyRates.useQuery({});
  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">Currency Rates</h1>
        <p className="mt-1 text-sm text-gray-500">
          D15-S08 — Multi-currency exchange rates for multi-branch financial
          reporting
        </p>
      </div>
      <div className="px-6">
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700">
              Active Exchange Rates
            </h2>
            <span className="text-xs text-gray-500">
              {q.data?.length ?? 0} rates
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {q.isLoading && (
              <div className="px-4 py-3 text-sm text-gray-400">Loading…</div>
            )}
            {q.data?.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">
                No currency rates configured
              </div>
            )}
            {q.data?.map((r) => (
              <div
                key={r.id}
                className="px-4 py-3 flex items-center justify-between"
              >
                <span className="text-sm font-medium text-gray-900">
                  {r.fromCurrency} → {r.toCurrency}
                </span>
                <span className="text-sm font-mono text-green-600">
                  {r.rate}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
