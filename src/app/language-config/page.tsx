"use client";
import { api } from "@/trpc/react";
export default function LanguageConfigPage() {
  const q = api.executiveGov.listLanguageConfigs.useQuery({});
  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Language Configuration
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          D15-S09 — Multi-language readiness flags per tenant
        </p>
      </div>
      <div className="px-6">
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700">
              Language Settings
            </h2>
            <span className="text-xs text-gray-500">
              {q.data?.length ?? 0} configured
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {q.data?.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">
                No languages configured
              </div>
            )}
            {(
              (q.data ?? []) as Array<{
                id: number;
                displayName: string;
                languageCode: string;
                rtl: string;
                isDefault: string;
                isEnabled: string;
              }>
            ).map((l) => (
              <div
                key={l.id}
                className="px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {l.displayName}
                  </span>
                  <span className="ml-2 text-xs font-mono text-gray-500">
                    {l.languageCode}
                  </span>
                  {l.rtl === "true" && (
                    <span className="ml-2 text-xs text-purple-600">RTL</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {l.isDefault === "true" && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${l.isEnabled === "true" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {l.isEnabled === "true" ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
