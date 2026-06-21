"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { api } from "@/trpc/react";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [complete, setComplete] = useState(false);
  const resetPassword = api.auth.resetPassword.useMutation({
    onSuccess: () => setComplete(true),
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetPassword.mutate({ token, newPassword });
  }

  if (!token) {
    return (
      <div className="mt-6 space-y-4">
        <p className="text-sm text-red-700">Password reset token is missing.</p>
        <Link className="text-sm text-[#1e2d3d]" href="/forgot-password">
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium text-[#1e2d3d]">
        New password
        <input
          className="mt-2 w-full rounded border border-[#d8cfbd] px-3 py-2 text-sm"
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          required
          minLength={12}
          autoComplete="new-password"
        />
      </label>
      {complete ? (
        <p className="text-sm text-green-700">Password updated.</p>
      ) : null}
      {resetPassword.error ? (
        <p className="text-sm text-red-700">
          Reset token is invalid or expired.
        </p>
      ) : null}
      <button
        className="w-full rounded bg-[#1e2d3d] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        type="submit"
        disabled={resetPassword.isPending || complete}
      >
        {resetPassword.isPending ? "Updating..." : "Update password"}
      </button>
      {complete ? (
        <Link
          className="block text-center text-sm text-[#1e2d3d]"
          href="/login"
        >
          Sign in
        </Link>
      ) : null}
    </form>
  );
}
