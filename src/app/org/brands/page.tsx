"use client";

import { useState } from "react";
import { api } from "@/trpc/react";

export default function BrandsPage() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: brands, refetch } = api.org.listBrands.useQuery({
    activeOnly: false,
  });

  const createBrand = api.org.createBrand.useMutation({
    onSuccess: () => {
      setShowForm(false);
      setName("");
      setCode("");
      setError(null);
      void refetch();
    },
    onError: (err) => setError(err.message),
  });

  const deactivateBrand = api.org.deactivateBrand.useMutation({
    onSuccess: () => void refetch(),
    onError: (err) => setError(err.message),
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    createBrand.mutate({ name, code: code.toUpperCase() });
  }

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1e2d3d]">Brands</h2>
          <p className="mt-1 text-sm text-[#5a6c7d]">
            Manage top-level brand entities in the organization.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((p) => !p)}
          className="rounded bg-[#1e2d3d] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a3f56]"
        >
          {showForm ? "Cancel" : "New Brand"}
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
          <h3 className="font-semibold text-[#1e2d3d]">Create Brand</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="brand-name"
                className="mb-1 block text-xs font-medium text-[#5a6c7d]"
              >
                Name *
              </label>
              <input
                id="brand-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. VetCare Group"
                className="w-full rounded border px-3 py-2 text-sm text-[#1e2d3d]"
              />
            </div>
            <div>
              <label
                htmlFor="brand-code"
                className="mb-1 block text-xs font-medium text-[#5a6c7d]"
              >
                Code * (uppercase alphanumeric)
              </label>
              <input
                id="brand-code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. VETCARE"
                pattern="[A-Z0-9_-]+"
                className="w-full rounded border px-3 py-2 text-sm font-mono text-[#1e2d3d]"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={createBrand.isPending}
              className="rounded bg-[#c9a84c] px-4 py-2 text-sm font-medium text-white hover:bg-[#b89640] disabled:opacity-50"
            >
              {createBrand.isPending ? "Creating…" : "Create Brand"}
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
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {!brands || brands.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-[#5a6c7d]"
                >
                  No brands yet.
                </td>
              </tr>
            ) : (
              brands.map((brand) => (
                <tr key={brand.id} className="border-t">
                  <td className="px-4 py-3 font-medium text-[#1e2d3d]">
                    {brand.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[#5a6c7d]">
                    {brand.code}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        brand.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {brand.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#5a6c7d]">
                    {brand.createdAt
                      ? new Date(brand.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {brand.isActive && (
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Deactivate "${brand.name}"? This cascades to all its branches.`,
                            )
                          ) {
                            deactivateBrand.mutate({ id: brand.id });
                          }
                        }}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Deactivate
                      </button>
                    )}
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
