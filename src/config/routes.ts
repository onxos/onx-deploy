import type { Permission } from "@/lib/permissions";

export type RouteIcon =
  | "activity"
  | "ask"
  | "book"
  | "chart"
  | "dashboard"
  | "dream"
  | "execution"
  | "gaps"
  | "goal"
  | "memory"
  | "potential"
  | "shield"
  | "spark"
  | "titan"
  | "users"
  | "workspace";

export interface RouteConfig {
  path: string;
  label: string;
  icon: RouteIcon;
  permission?: Permission;
  group?: string;
  children?: RouteConfig[];
  external?: boolean;
}

export const mainRoutes: RouteConfig[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: "dashboard",
    group: "Overview",
  },
  { path: "/analytics", label: "Analytics", icon: "chart", group: "Overview" },
  { path: "/reports", label: "Reports", icon: "book", group: "Overview" },
  { path: "/profile", label: "Profile", icon: "users", group: "Overview" },
  { path: "/settings", label: "Settings", icon: "shield", group: "Overview" },
  {
    path: "/notifications",
    label: "Notifications",
    icon: "activity",
    group: "Overview",
  },
  {
    path: "/institution",
    label: "Institution",
    icon: "users",
    group: "Organization",
  },
  {
    path: "/companion",
    label: "Companion",
    icon: "spark",
    group: "Gate 6",
  },
  { path: "/dreams", label: "Dreams", icon: "dream", group: "Dream to Goal" },
  {
    path: "/potential",
    label: "Potential",
    icon: "potential",
    group: "Dream to Goal",
  },
  { path: "/goals", label: "Goals", icon: "goal", group: "Dream to Goal" },
  {
    path: "/workspace",
    label: "Workspace",
    icon: "workspace",
    group: "Dream to Goal",
  },
  {
    path: "/execution",
    label: "Execution",
    icon: "execution",
    group: "Dream to Goal",
  },
  {
    path: "/outcomes",
    label: "Outcomes",
    icon: "goal",
    group: "Dream to Goal",
  },
  {
    path: "/flourishing",
    label: "Flourishing",
    icon: "spark",
    group: "Dream to Goal",
  },
  {
    path: "/recognition",
    label: "Recognition",
    icon: "shield",
    group: "Dream to Goal",
  },
  {
    path: "/evolution",
    label: "Evolution",
    icon: "activity",
    group: "Dream to Goal",
  },
  {
    path: "/retrospectives",
    label: "Retrospectives",
    icon: "book",
    group: "Dream to Goal",
  },
  { path: "/pulse", label: "Pulse", icon: "activity", group: "Overview" },
  {
    path: "/knowledge",
    label: "Knowledge",
    icon: "book",
    group: "Civilization",
  },
  {
    path: "/constitution",
    label: "Constitution",
    icon: "shield",
    group: "Civilization",
  },
  {
    path: "/registry",
    label: "Titan Registry",
    icon: "titan",
    group: "Civilization",
  },
  { path: "/memory", label: "Memory", icon: "memory", group: "Civilization" },
  {
    path: "/gaps",
    label: "Gap Closure",
    icon: "gaps",
    permission: "gap:update",
    group: "Operations",
  },
  { path: "/ask", label: "Ask ONX", icon: "ask", group: "Gate 6" },
  {
    path: "/titan-conclave",
    label: "Titan Conclave",
    icon: "spark",
    group: "Gate 6",
  },
  {
    path: "/va-capabilities",
    label: "VA Capabilities",
    icon: "chart",
    group: "Gate 6",
  },
  {
    path: "/admin",
    label: "Admin",
    icon: "users",
    permission: "admin:read",
    group: "Administration",
    children: [
      {
        path: "/admin/civilization",
        label: "Civilization Admin",
        icon: "book",
        permission: "article:create",
      },
      {
        path: "/admin/titans",
        label: "Titan Admin",
        icon: "titan",
        permission: "admin:read",
      },
      {
        path: "/admin/knowledge",
        label: "Knowledge Admin",
        icon: "book",
        permission: "admin:read",
      },
      {
        path: "/admin/security",
        label: "Security Admin",
        icon: "shield",
        permission: "admin:read",
      },
      {
        path: "/admin/operations",
        label: "Operations Admin",
        icon: "activity",
        permission: "admin:read",
      },
      {
        path: "/admin/releases",
        label: "Release Admin",
        icon: "chart",
        permission: "admin:read",
      },
      {
        path: "/admin/data",
        label: "Data Admin",
        icon: "memory",
        permission: "admin:read",
      },
      {
        path: "/admin/acceptance",
        label: "Acceptance Admin",
        icon: "shield",
        permission: "admin:read",
      },
      {
        path: "/admin/launch",
        label: "Launch Admin",
        icon: "spark",
        permission: "admin:read",
      },
      {
        path: "/admin/closure",
        label: "Closure Admin",
        icon: "goal",
        permission: "admin:read",
      },
      {
        path: "/admin/handover",
        label: "Handover Admin",
        icon: "workspace",
        permission: "admin:read",
      },
    ],
  },
];

export const routeLabels = new Map(
  mainRoutes.flatMap((route) => [
    [route.path, route.label] as const,
    ...(route.children?.map((child) => [child.path, child.label] as const) ??
      []),
  ]),
);
