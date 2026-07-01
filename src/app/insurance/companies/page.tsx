"use client";

import { api } from "@/trpc/react";

export default function InsuranceCompaniesPage() {
  const { data: companies, isLoading } = api.insurance.listCompanies.useQuery(
    {},
  );

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Insurance Companies</h1>
      {isLoading && <p>Loading…</p>}
      {!isLoading && (!companies || companies.length === 0) && (
        <p className="text-gray-500">No insurance companies found.</p>
      )}
      {companies && companies.length > 0 && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2 text-left">Code</th>
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-left">Status</th>
              <th className="border px-3 py-2 text-right">Credit Days</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id} className="odd:bg-white even:bg-gray-50">
                <td className="border px-3 py-2 font-mono">{c.code}</td>
                <td className="border px-3 py-2">{c.name}</td>
                <td className="border px-3 py-2">{c.status}</td>
                <td className="border px-3 py-2 text-right">{c.creditDays}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
