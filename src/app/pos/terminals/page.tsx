"use client";

import { api } from "@/trpc/react";

export default function TerminalsPage() {
  const { data: terminals, isLoading } = api.pos.listTerminals.useQuery({
    branchId: 1,
  });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">POS Terminals</h1>
      {isLoading && <p>Loading…</p>}
      {!isLoading && (!terminals || terminals.length === 0) && (
        <p className="text-gray-500">No terminals found.</p>
      )}
      {terminals && terminals.length > 0 && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2 text-left">Code</th>
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-left">Status</th>
              <th className="border px-3 py-2 text-left">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {terminals.map((t) => (
              <tr key={t.id} className="odd:bg-white even:bg-gray-50">
                <td className="border px-3 py-2 font-mono">{t.terminalCode}</td>
                <td className="border px-3 py-2">{t.terminalName}</td>
                <td className="border px-3 py-2">{t.status}</td>
                <td className="border px-3 py-2">{t.ipAddress ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
