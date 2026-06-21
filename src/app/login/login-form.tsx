"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const defaultCallbackUrl = "/pulse";
const allowedCallbackPaths = new Set([
  "/admin",
  "/gaps",
  "/pulse",
  "/registry",
]);

function safeCallbackUrl(value: string | null) {
  if (!value) return defaultCallbackUrl;

  try {
    const callbackUrl = new URL(value, "https://onx.local");

    if (
      callbackUrl.origin !== "https://onx.local" ||
      !allowedCallbackPaths.has(callbackUrl.pathname)
    ) {
      return defaultCallbackUrl;
    }

    return `${callbackUrl.pathname}${callbackUrl.search}${callbackUrl.hash}`;
  } catch {
    return defaultCallbackUrl;
  }
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = safeCallbackUrl(searchParams.get("callbackUrl"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await authClient.signIn.email({
      email,
      password,
      callbackURL: callbackUrl,
    });

    setIsSubmitting(false);

    if (result.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
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
      <label className="block text-sm font-medium text-[#1e2d3d]">
        Password
        <input
          className="mt-2 w-full rounded border border-[#d8cfbd] px-3 py-2 text-sm"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="current-password"
        />
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        className="w-full rounded bg-[#1e2d3d] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
      <Link
        className="block text-center text-sm text-[#1e2d3d]"
        href="/forgot-password"
      >
        Forgot password?
      </Link>
    </form>
  );
}
