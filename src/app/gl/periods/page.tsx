"use client";

import { api } from "@/trpc/react";

export default function GlPeriodsPage() {
  const { data: periods, isLoading } = api.gl.listPeriods.useQuery({
    branchId: 1,
  });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Fiscal Periods</h1>
      {isLoading && <p>Loading…</p>}
      {!isLoading && (!periods || periods.length === 0) && (
        <p className="text-gray-500">No periods found.</p>
      )}
      {periods && periods.length > 0 && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-left">Start</th>
              <th className="border px-3 py-2 text-left">End</th>
              <th className="border px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {periods.map((p) => (
              <tr key={p.id} className="odd:bg-white even:bg-gray-50">
                <td className="border px-3 py-2">{p.name}</td>
                <td className="border px-3 py-2">{p.startDate}</td>
                <td className="border px-3 py-2">{p.endDate}</td>
                <td className="border px-3 py-2">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
