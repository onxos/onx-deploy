"use client";

import Link from "next/link";
import type { RouteConfig } from "@/config/routes";
import { cn } from "@/lib/utils";
import { RouteIconMark } from "./route-icon";

interface NavItemProps {
  route: RouteConfig;
  isActive: boolean;
  isCollapsed?: boolean;
  onNavigate?: () => void;
}

export function NavItem({
  route,
  isActive,
  isCollapsed = false,
  onNavigate,
}: NavItemProps) {
  return (
    <Link
      href={route.path}
      target={route.external ? "_blank" : undefined}
      rel={route.external ? "noreferrer" : undefined}
      title={isCollapsed ? route.label : undefined}
      onClick={onNavigate}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isCollapsed && "justify-center px-2",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      )}
    >
      <RouteIconMark icon={route.icon} />
      {!isCollapsed && (
        <span className="truncate">
          {route.label}
          {route.external ? " ↗" : ""}
        </span>
      )}
    </Link>
  );
}
