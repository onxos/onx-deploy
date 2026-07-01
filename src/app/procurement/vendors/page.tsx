"use client";

import { api } from "@/trpc/react";

export default function VendorsPage() {
  const { data: vendors, isLoading } = api.procurement.listVendors.useQuery({});

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Vendors</h1>
      {isLoading && <p>Loading…</p>}
      {!isLoading && (!vendors || vendors.length === 0) && (
        <p className="text-gray-500">No vendors found.</p>
      )}
      {vendors && vendors.length > 0 && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2 text-left">Code</th>
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-left">Type</th>
              <th className="border px-3 py-2 text-left">Status</th>
              <th className="border px-3 py-2 text-left">Qualification</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v.id} className="odd:bg-white even:bg-gray-50">
                <td className="border px-3 py-2 font-mono">{v.code}</td>
                <td className="border px-3 py-2">{v.name}</td>
                <td className="border px-3 py-2">{v.vendorType}</td>
                <td className="border px-3 py-2">{v.status}</td>
                <td className="border px-3 py-2">{v.qualificationStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
