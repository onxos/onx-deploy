"use client";

import { api } from "@/trpc/react";

export default function ClientsPage() {
  const { data: clients, isLoading } = api.crm.listClients.useQuery({
    branchId: 1,
  });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Clients</h1>
      {isLoading && <p>Loading…</p>}
      {!isLoading && (!clients || clients.length === 0) && (
        <p className="text-gray-500">No clients found.</p>
      )}
      {clients && clients.length > 0 && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-left">Phone</th>
              <th className="border px-3 py-2 text-left">Email</th>
              <th className="border px-3 py-2 text-left">Loyalty</th>
              <th className="border px-3 py-2 text-right">Visits</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="odd:bg-white even:bg-gray-50">
                <td className="border px-3 py-2">
                  {c.firstName} {c.lastName}
                </td>
                <td className="border px-3 py-2">{c.phone}</td>
                <td className="border px-3 py-2">{c.email ?? "—"}</td>
                <td className="border px-3 py-2">{c.loyaltyTier}</td>
                <td className="border px-3 py-2 text-right">{c.totalVisits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
