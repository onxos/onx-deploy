"use client";

import { api } from "@/trpc/react";

export default function GlEntriesPage() {
  const { data: entries, isLoading } = api.gl.listEntries.useQuery({
    branchId: 1,
  });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">GL Journal Entries</h1>
      {isLoading && <p>Loading…</p>}
      {!isLoading && (!entries || entries.length === 0) && (
        <p className="text-gray-500">No entries found.</p>
      )}
      {entries && entries.length > 0 && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2 text-left">Entry #</th>
              <th className="border px-3 py-2 text-left">Type</th>
              <th className="border px-3 py-2 text-right">Debit</th>
              <th className="border px-3 py-2 text-right">Credit</th>
              <th className="border px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="odd:bg-white even:bg-gray-50">
                <td className="border px-3 py-2 font-mono">{e.entryNumber}</td>
                <td className="border px-3 py-2">{e.entryType}</td>
                <td className="border px-3 py-2 text-right">{e.totalDebit}</td>
                <td className="border px-3 py-2 text-right">{e.totalCredit}</td>
                <td className="border px-3 py-2">{e.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
