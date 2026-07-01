"use client";

import { api } from "@/trpc/react";

export default function PetsPage() {
  const { data: pets, isLoading } = api.crm.listPets.useQuery({
    activeOnly: true,
  });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Pets</h1>
      {isLoading && <p>Loading…</p>}
      {!isLoading && (!pets || pets.length === 0) && (
        <p className="text-gray-500">No pets found.</p>
      )}
      {pets && pets.length > 0 && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-left">Species</th>
              <th className="border px-3 py-2 text-left">Breed</th>
              <th className="border px-3 py-2 text-left">Gender</th>
              <th className="border px-3 py-2 text-right">Weight (kg)</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((p) => (
              <tr key={p.id} className="odd:bg-white even:bg-gray-50">
                <td className="border px-3 py-2">{p.name}</td>
                <td className="border px-3 py-2">{p.species}</td>
                <td className="border px-3 py-2">{p.breed ?? "—"}</td>
                <td className="border px-3 py-2">{p.gender ?? "—"}</td>
                <td className="border px-3 py-2 text-right">
                  {p.weightKg ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
