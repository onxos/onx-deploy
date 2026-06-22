"use client";

import Link from "next/link";
import { NavMenu } from "./nav-menu";
import { UserMenuMini } from "./user-menu-mini";

export function Sidebar({ isCollapsed = false }: { isCollapsed?: boolean }) {
  return (
    <aside
      className="hidden h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex"
      data-collapsed={isCollapsed}
      style={{ width: isCollapsed ? 64 : 256 }}
    >
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <Link
          href="/dashboard"
          className="flex min-h-11 items-center gap-2 rounded-md font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          title="ONX Dashboard"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            O
          </span>
          {!isCollapsed && <span className="text-xl">ONX</span>}
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <NavMenu isCollapsed={isCollapsed} />
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <UserMenuMini isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
}
