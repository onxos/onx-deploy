"use client";

import type { RouteConfig } from "@/config/routes";
import { hasPermission, type Permission, type Role } from "@/lib/permissions";
import { api } from "@/trpc/react";

function canReadRoute(role: Role | undefined, permission?: Permission) {
  if (!permission) return true;
  if (!role) return false;
  return hasPermission(role, permission);
}

function filterRoutes(routes: RouteConfig[], role: Role | undefined) {
  return routes
    .filter((route) => canReadRoute(role, route.permission))
    .map((route) => ({
      ...route,
      children: route.children?.filter((child) =>
        canReadRoute(role, child.permission),
      ),
    }));
}

export function useNavPermissions(routes: RouteConfig[]) {
  const session = api.auth.session.useQuery(undefined, {
    retry: false,
    staleTime: 60_000,
  });
  const role = session.data?.user.role as Role | undefined;

  return {
    isLoading: session.isLoading,
    role,
    user: session.data?.user,
    routes: filterRoutes(routes, role),
  };
}
