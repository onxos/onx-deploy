"use client";

import { mainRoutes } from "@/config/routes";
import { useNavPermissions } from "@/hooks/use-nav-permissions";
import { Skeleton } from "../ui/skeleton";
import { NavSection } from "./nav-section";

function groupRoutes(routes: typeof mainRoutes) {
  return routes.reduce<Record<string, typeof mainRoutes>>((groups, route) => {
    const key = route.group ?? "Other";
    groups[key] = [...(groups[key] ?? []), route];
    return groups;
  }, {});
}

export function NavMenu({
  isCollapsed = false,
  onNavigate,
}: {
  isCollapsed?: boolean;
  onNavigate?: () => void;
}) {
  const { routes, isLoading } = useNavPermissions(mainRoutes);
  const groupedRoutes = groupRoutes(routes);

  if (isLoading) {
    return (
      <div className="space-y-3 px-1">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedRoutes).map(([group, groupRoutes]) => (
        <NavSection
          key={group}
          title={group}
          routes={groupRoutes}
          isCollapsed={isCollapsed}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}
