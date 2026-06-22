"use client";

import { useState } from "react";
import type { RouteConfig } from "@/config/routes";
import { useActiveRoute } from "@/hooks/use-active-route";
import { cn } from "@/lib/utils";
import { NavItem } from "./nav-item";

export function NavSection({
  title,
  routes,
  isCollapsed = false,
  onNavigate,
}: {
  title: string;
  routes: RouteConfig[];
  isCollapsed?: boolean;
  onNavigate?: () => void;
}) {
  const { isActive } = useActiveRoute();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="space-y-1">
      {!isCollapsed && (
        <button
          type="button"
          className="flex min-h-11 w-full items-center justify-between rounded-md px-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span>{title}</span>
          <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
        </button>
      )}
      {(isCollapsed || isOpen) && (
        <div className={cn("space-y-1", !isCollapsed && "pl-1")}>
          {routes.map((route) => (
            <div key={route.path} className="space-y-1">
              <NavItem
                route={route}
                isActive={isActive(route.path)}
                isCollapsed={isCollapsed}
                onNavigate={onNavigate}
              />
              {!isCollapsed &&
                route.children?.map((child) => (
                  <div key={child.path} className="pl-5">
                    <NavItem
                      route={child}
                      isActive={isActive(child.path)}
                      onNavigate={onNavigate}
                    />
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
