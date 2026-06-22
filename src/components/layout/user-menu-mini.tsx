"use client";

import { api } from "@/trpc/react";

export function UserMenuMini({
  isCollapsed = false,
}: {
  isCollapsed?: boolean;
}) {
  const { data: session } = api.auth.session.useQuery(undefined, {
    retry: false,
    staleTime: 60_000,
  });
  const user = session?.user;
  const label = user?.name ?? "Public session";
  const role = user?.role ?? "public";

  return (
    <div
      className="flex min-h-11 items-center gap-3 rounded-md px-2 py-2"
      title={isCollapsed ? `${label} (${role})` : undefined}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
        {(user?.name ?? user?.email ?? "ON").slice(0, 2).toUpperCase()}
      </div>
      {!isCollapsed && (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {label}
          </p>
          <p className="truncate text-xs text-muted-foreground">{role}</p>
        </div>
      )}
    </div>
  );
}
