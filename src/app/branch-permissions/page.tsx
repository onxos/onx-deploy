"use client";

/**
 * OCMBR Wave 1 — D15-S04 IU-UI
 * Branch-level Permission Scoping page
 *
 * Displays and manages branch-scoped role assignments per user.
 * Only admin/founder may grant or revoke branch roles.
 *
 * OCMBR Reference: D15-S04-IU-UI
 */

import { useState } from "react";
import { api } from "@/trpc/react";

export default function BranchPermissionsPage() {
  const [userId, setUserId] = useState("");
  const [searchUserId, setSearchUserId] = useState<string | null>(null);
  const [grantForm, setGrantForm] = useState({
    userId: "",
    branchId: "",
    role: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { data: branches } = api.org.listBranches.useQuery({
    activeOnly: true,
  });
  const { data: userRoles, refetch } =
    api.branchRbac.getUserBranchRoles.useQuery(
      { userId: searchUserId ?? "" },
      { enabled: !!searchUserId },
    );

  const grantRole = api.branchRbac.grantBranchRole.useMutation({
    onSuccess: () => {
      setSuccess("Role granted successfully.");
      setError(null);
      setGrantForm({ userId: "", branchId: "", role: "" });
      void refetch();
    },
    onError: (err) => {
      setError(err.message);
      setSuccess(null);
    },
  });

  const revokeRole = api.branchRbac.revokeBranchRole.useMutation({
    onSuccess: () => {
      setSuccess("Role revoked.");
      setError(null);
      void refetch();
    },
    onError: (err) => {
      setError(err.message);
      setSuccess(null);
    },
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (userId.trim()) setSearchUserId(userId.trim());
  }

  function handleGrant(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    grantRole.mutate({
      userId: grantForm.userId,
      branchId: Number(grantForm.branchId),
      role: grantForm.role,
    });
  }

  const branchMap = Object.fromEntries(
    (branches ?? []).map((b) => [b.id, `${b.name} (${b.code})`]),
  );

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[#1e2d3d]">
          Branch Role Assignments
        </h2>
        <p className="mt-1 text-sm text-[#5a6c7d]">
          Manage branch-scoped role assignments for users. Platform roles
          (operator / admin / founder) take precedence for platform resources;
          branch roles apply to domain resources.
        </p>
      </div>

      {error && (
        <p className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
          {success}
        </p>
      )}

      {/* Lookup user roles */}
      <div className="rounded border bg-white p-6 space-y-4">
        <h3 className="font-semibold text-[#1e2d3d]">Look Up User Roles</h3>
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            placeholder="User ID…"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            className="flex-1 rounded border px-3 py-2 text-sm text-[#1e2d3d]"
          />
          <button
            type="submit"
            className="rounded bg-[#1e2d3d] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a3f56]"
          >
            Search
          </button>
        </form>

        {searchUserId && (
          <div className="mt-4">
            <p className="text-xs text-[#5a6c7d] mb-2">
              Branch roles for user:{" "}
              <span className="font-mono">{searchUserId}</span>
            </p>
            {!userRoles || userRoles.length === 0 ? (
              <p className="text-sm text-[#5a6c7d] italic">
                No branch roles assigned.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-[#5a6c7d]">
                    <th className="pb-2 pr-4">Branch</th>
                    <th className="pb-2 pr-4">Role</th>
                    <th className="pb-2 pr-4">Granted At</th>
                    <th className="pb-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userRoles.map((r) => (
                    <tr key={r.id} className="border-b last:border-0">
                      <td className="py-2 pr-4">
                        {branchMap[r.branchId] ?? r.branchId}
                      </td>
                      <td className="py-2 pr-4 font-mono text-xs">{r.role}</td>
                      <td className="py-2 pr-4 text-xs text-[#5a6c7d]">
                        {r.grantedAt
                          ? new Date(r.grantedAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="py-2">
                        <button
                          type="button"
                          onClick={() =>
                            revokeRole.mutate({
                              userId: r.userId,
                              branchId: r.branchId,
                            })
                          }
                          className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Grant role form */}
      <div className="rounded border bg-white p-6 space-y-4">
        <h3 className="font-semibold text-[#1e2d3d]">Grant Branch Role</h3>
        <form onSubmit={handleGrant} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label
                htmlFor="grant-user-id"
                className="mb-1 block text-xs font-medium text-[#5a6c7d]"
              >
                User ID *
              </label>
              <input
                id="grant-user-id"
                type="text"
                required
                value={grantForm.userId}
                onChange={(e) =>
                  setGrantForm((p) => ({ ...p, userId: e.target.value }))
                }
                className="w-full rounded border px-3 py-2 text-sm text-[#1e2d3d]"
              />
            </div>
            <div>
              <label
                htmlFor="grant-branch"
                className="mb-1 block text-xs font-medium text-[#5a6c7d]"
              >
                Branch *
              </label>
              <select
                id="grant-branch"
                required
                value={grantForm.branchId}
                onChange={(e) =>
                  setGrantForm((p) => ({ ...p, branchId: e.target.value }))
                }
                className="w-full rounded border px-3 py-2 text-sm text-[#1e2d3d]"
              >
                <option value="">Select a branch…</option>
                {(branches ?? []).map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="grant-role"
                className="mb-1 block text-xs font-medium text-[#5a6c7d]"
              >
                Role *
              </label>
              <select
                id="grant-role"
                required
                value={grantForm.role}
                onChange={(e) =>
                  setGrantForm((p) => ({ ...p, role: e.target.value }))
                }
                className="w-full rounded border px-3 py-2 text-sm text-[#1e2d3d]"
              >
                <option value="">Select a role…</option>
                {[
                  "branch_manager",
                  "clinician",
                  "receptionist",
                  "pharmacist",
                  "finance_officer",
                  "hr_officer",
                  "cashier",
                ].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={grantRole.isPending}
            className="rounded bg-[#1e2d3d] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a3f56] disabled:opacity-60"
          >
            {grantRole.isPending ? "Granting…" : "Grant Role"}
          </button>
        </form>
      </div>

      {/* Info panel */}
      <div className="rounded border border-[#e6dfcf] bg-[#fffdf5] p-4 text-sm text-[#5a6c7d]">
        <p className="font-medium text-[#1e2d3d] mb-1">Branch Role Model</p>
        <p>
          Branch roles extend the platform RBAC system. A user with a branch
          role gains scoped access to domain resources (clinical records, HR
          data, finance entries) within that branch only. Platform roles (admin,
          founder) always take precedence.
        </p>
      </div>
    </section>
  );
}
