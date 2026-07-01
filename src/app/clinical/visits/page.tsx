"use client";

import { api } from "@/trpc/react";

export default function VisitsPage() {
  const { data: visits, isLoading } = api.clinical.listVisits.useQuery({
    branchId: 1,
  });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Patient Visits</h1>
      {isLoading && <p>Loading…</p>}
      {!isLoading && (!visits || visits.length === 0) && (
        <p className="text-gray-500">No visits found.</p>
      )}
      {visits && visits.length > 0 && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2 text-left">Visit #</th>
              <th className="border px-3 py-2 text-left">Type</th>
              <th className="border px-3 py-2 text-left">Status</th>
              <th className="border px-3 py-2 text-left">Scheduled At</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((v) => (
              <tr key={v.id} className="odd:bg-white even:bg-gray-50">
                <td className="border px-3 py-2 font-mono">{v.visitNumber}</td>
                <td className="border px-3 py-2">{v.visitType}</td>
                <td className="border px-3 py-2">{v.status}</td>
                <td className="border px-3 py-2">
                  {v.scheduledAt
                    ? new Date(v.scheduledAt).toLocaleString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
