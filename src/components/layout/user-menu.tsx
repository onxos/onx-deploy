"use client";

import { useState } from "react";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

function initials(name?: string | null, email?: string | null) {
  const source = name || email || "ONX";
  return source
    .split(/\s|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const { data: session } = api.auth.session.useQuery(undefined, {
    retry: false,
    staleTime: 60_000,
  });
  const user = session?.user;

  return (
    <div className="relative">
      <button
        type="button"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-primary text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {initials(user?.name, user?.email)}
      </button>
      <div
        className={cn(
          "absolute right-0 top-12 z-40 w-64 rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-md",
          open ? "block" : "hidden",
        )}
        role="menu"
      >
        <div className="border-b border-border px-3 py-2">
          <p className="truncate text-sm font-semibold">
            {user?.name ?? "Signed-out operator"}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {user?.email ?? "No active session"}
          </p>
          <p className="mt-1 text-xs font-medium uppercase text-primary">
            {user?.role ?? "public"}
          </p>
        </div>
        <button
          type="button"
          className="mt-2 flex min-h-11 w-full items-center rounded-md px-3 text-left text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={async () => {
            await signOut();
            window.location.href = "/login";
          }}
          role="menuitem"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
