"use client";

import { api } from "@/trpc/react";

export default function AccountsPage() {
  const { data: accounts, isLoading } = api.finance.listAccounts.useQuery({
    activeOnly: true,
  });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Chart of Accounts</h1>
      {isLoading && <p>Loading…</p>}
      {!isLoading && (!accounts || accounts.length === 0) && (
        <p className="text-gray-500">No accounts found.</p>
      )}
      {accounts && accounts.length > 0 && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2 text-left">Code</th>
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-left">Type</th>
              <th className="border px-3 py-2 text-right">Level</th>
              <th className="border px-3 py-2 text-left">System?</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((a) => (
              <tr key={a.id} className="odd:bg-white even:bg-gray-50">
                <td className="border px-3 py-2 font-mono">{a.code}</td>
                <td className="border px-3 py-2">{a.name}</td>
                <td className="border px-3 py-2">{a.accountType}</td>
                <td className="border px-3 py-2 text-right">{a.level}</td>
                <td className="border px-3 py-2">
                  {a.isSystemAccount ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
