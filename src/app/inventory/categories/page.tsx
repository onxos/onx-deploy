"use client";

import { api } from "@/trpc/react";

export default function CategoriesPage() {
  const { data: categories, isLoading } = api.inventory.listCategories.useQuery(
    { activeOnly: true },
  );

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Item Categories</h1>
      {isLoading && <p>Loading…</p>}
      {!isLoading && (!categories || categories.length === 0) && (
        <p className="text-gray-500">No categories found.</p>
      )}
      {categories && categories.length > 0 && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2 text-left">Code</th>
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-left">Active</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="odd:bg-white even:bg-gray-50">
                <td className="border px-3 py-2 font-mono">{c.code}</td>
                <td className="border px-3 py-2">{c.name}</td>
                <td className="border px-3 py-2">
                  {c.isActive ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
