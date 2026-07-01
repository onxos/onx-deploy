"use client";

import { api } from "@/trpc/react";

export default function EmployeesPage() {
  const { data: employees, isLoading } = api.hr.listEmployees.useQuery({
    branchId: 1,
  });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Employees</h1>
      {isLoading && <p>Loading…</p>}
      {!isLoading && (!employees || employees.length === 0) && (
        <p className="text-gray-500">No employees found.</p>
      )}
      {employees && employees.length > 0 && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2 text-left">ID</th>
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-left">Job Title</th>
              <th className="border px-3 py-2 text-left">Type</th>
              <th className="border px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e.id} className="odd:bg-white even:bg-gray-50">
                <td className="border px-3 py-2">{e.employeeNumber}</td>
                <td className="border px-3 py-2">
                  {e.firstName} {e.lastName}
                </td>
                <td className="border px-3 py-2">{e.jobTitle ?? "—"}</td>
                <td className="border px-3 py-2">{e.employmentType}</td>
                <td className="border px-3 py-2">{e.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
