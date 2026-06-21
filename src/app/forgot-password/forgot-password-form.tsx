"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "@/trpc/react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const requestReset = api.auth.requestPasswordReset.useMutation({
    onSuccess: () => setSent(true),
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    requestReset.mutate({ email });
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium text-[#1e2d3d]">
        Email
        <input
          className="mt-2 w-full rounded border border-[#d8cfbd] px-3 py-2 text-sm"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
        />
      </label>
      {sent ? (
        <p className="text-sm text-green-700">
          If an account exists for that email, a reset link has been sent.
        </p>
      ) : null}
      {requestReset.error ? (
        <p className="text-sm text-red-700">Unable to request reset.</p>
      ) : null}
      <button
        className="w-full rounded bg-[#1e2d3d] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        type="submit"
        disabled={requestReset.isPending}
      >
        {requestReset.isPending ? "Sending..." : "Send reset link"}
      </button>
      <Link className="block text-center text-sm text-[#1e2d3d]" href="/login">
        Back to sign in
      </Link>
    </form>
  );
}
