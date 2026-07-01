"use client";

import { api } from "@/trpc/react";

export default function ItemsPage() {
  const { data: items, isLoading } = api.inventory.listItems.useQuery({
    activeOnly: true,
  });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Inventory Items</h1>
      {isLoading && <p>Loading…</p>}
      {!isLoading && (!items || items.length === 0) && (
        <p className="text-gray-500">No items found.</p>
      )}
      {items && items.length > 0 && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2 text-left">SKU</th>
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-left">Type</th>
              <th className="border px-3 py-2 text-right">Unit Price</th>
              <th className="border px-3 py-2 text-left">Rx?</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="odd:bg-white even:bg-gray-50">
                <td className="border px-3 py-2 font-mono">{i.sku}</td>
                <td className="border px-3 py-2">{i.name}</td>
                <td className="border px-3 py-2">{i.itemType}</td>
                <td className="border px-3 py-2 text-right">{i.unitPrice}</td>
                <td className="border px-3 py-2">
                  {i.requiresPrescription ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
