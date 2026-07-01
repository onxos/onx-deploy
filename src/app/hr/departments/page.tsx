"use client";

import { api } from "@/trpc/react";

export default function DepartmentsPage() {
  const { data: departments, isLoading } = api.hr.listDepartments.useQuery({
    branchId: 1,
  });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Departments</h1>
      {isLoading && <p>Loading…</p>}
      {!isLoading && (!departments || departments.length === 0) && (
        <p className="text-gray-500">No departments found.</p>
      )}
      {departments && departments.length > 0 && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2 text-left">Code</th>
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-left">Active</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((d) => (
              <tr key={d.id} className="odd:bg-white even:bg-gray-50">
                <td className="border px-3 py-2 font-mono">{d.code}</td>
                <td className="border px-3 py-2">{d.name}</td>
                <td className="border px-3 py-2">
                  {d.isActive ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
