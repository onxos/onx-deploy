"use client";

import { useState } from "react";
import { api } from "@/trpc/react";

export default function BranchesPage() {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    brandId: "",
    name: "",
    code: "",
    city: "",
    country: "SA",
    isHeadquarters: false,
  });

  const { data: brands } = api.org.listBrands.useQuery({ activeOnly: true });
  const { data: branches, refetch } = api.org.listBranches.useQuery({
    activeOnly: false,
  });

  const createBranch = api.org.createBranch.useMutation({
    onSuccess: () => {
      setShowForm(false);
      setForm({
        brandId: "",
        name: "",
        code: "",
        city: "",
        country: "SA",
        isHeadquarters: false,
      });
      setError(null);
      void refetch();
    },
    onError: (err) => setError(err.message),
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!form.brandId) {
      setError("Please select a brand.");
      return;
    }
    createBranch.mutate({
      brandId: Number(form.brandId),
      name: form.name,
      code: form.code.toUpperCase(),
      city: form.city || undefined,
      country: form.country,
      isHeadquarters: form.isHeadquarters,
    });
  }

  const brandMap = Object.fromEntries(
    (brands ?? []).map((b) => [b.id, b.name]),
  );

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1e2d3d]">Branches</h2>
          <p className="mt-1 text-sm text-[#5a6c7d]">
            Manage branches across all brands.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((p) => !p)}
          className="rounded bg-[#1e2d3d] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a3f56]"
        >
          {showForm ? "Cancel" : "New Branch"}
        </button>
      </div>

      {error && (
        <p className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded border bg-white p-6"
        >
          <h3 className="font-semibold text-[#1e2d3d]">Create Branch</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="branch-brand"
                className="mb-1 block text-xs font-medium text-[#5a6c7d]"
              >
                Brand *
              </label>
              <select
                id="branch-brand"
                required
                value={form.brandId}
                onChange={(e) =>
                  setForm((p) => ({ ...p, brandId: e.target.value }))
                }
                className="w-full rounded border px-3 py-2 text-sm text-[#1e2d3d]"
              >
                <option value="">Select a brand…</option>
                {(brands ?? []).map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="branch-name"
                className="mb-1 block text-xs font-medium text-[#5a6c7d]"
              >
                Name *
              </label>
              <input
                id="branch-name"
                required
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Riyadh Main Clinic"
                className="w-full rounded border px-3 py-2 text-sm text-[#1e2d3d]"
              />
            </div>
            <div>
              <label
                htmlFor="branch-code"
                className="mb-1 block text-xs font-medium text-[#5a6c7d]"
              >
                Code * (uppercase)
              </label>
              <input
                id="branch-code"
                required
                value={form.code}
                onChange={(e) =>
                  setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))
                }
                placeholder="e.g. RYD-MAIN"
                pattern="[A-Z0-9_-]+"
                className="w-full rounded border px-3 py-2 text-sm font-mono text-[#1e2d3d]"
              />
            </div>
            <div>
              <label
                htmlFor="branch-city"
                className="mb-1 block text-xs font-medium text-[#5a6c7d]"
              >
                City
              </label>
              <input
                id="branch-city"
                value={form.city}
                onChange={(e) =>
                  setForm((p) => ({ ...p, city: e.target.value }))
                }
                placeholder="e.g. Riyadh"
                className="w-full rounded border px-3 py-2 text-sm text-[#1e2d3d]"
              />
            </div>
            <div>
              <label
                htmlFor="branch-country"
                className="mb-1 block text-xs font-medium text-[#5a6c7d]"
              >
                Country (ISO 2-letter)
              </label>
              <input
                id="branch-country"
                value={form.country}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    country: e.target.value.toUpperCase().slice(0, 2),
                  }))
                }
                maxLength={2}
                className="w-full rounded border px-3 py-2 text-sm font-mono text-[#1e2d3d]"
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input
                id="hq"
                type="checkbox"
                checked={form.isHeadquarters}
                onChange={(e) =>
                  setForm((p) => ({ ...p, isHeadquarters: e.target.checked }))
                }
                className="h-4 w-4"
              />
              <label htmlFor="hq" className="text-sm text-[#1e2d3d]">
                Headquarters
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={createBranch.isPending}
              className="rounded bg-[#c9a84c] px-4 py-2 text-sm font-medium text-white hover:bg-[#b89640] disabled:opacity-50"
            >
              {createBranch.isPending ? "Creating…" : "Create Branch"}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#1e2d3d] text-white">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">HQ</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {!branches || branches.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-[#5a6c7d]"
                >
                  No branches yet.
                </td>
              </tr>
            ) : (
              branches.map((branch) => (
                <tr key={branch.id} className="border-t">
                  <td className="px-4 py-3 font-medium text-[#1e2d3d]">
                    {branch.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[#5a6c7d]">
                    {branch.code}
                  </td>
                  <td className="px-4 py-3 text-[#5a6c7d]">
                    {brandMap[branch.brandId] ?? `#${branch.brandId}`}
                  </td>
                  <td className="px-4 py-3 text-[#5a6c7d]">
                    {branch.city ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {branch.isHeadquarters ? (
                      <span className="text-xs font-medium text-[#c9a84c]">
                        ★
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        branch.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {branch.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
