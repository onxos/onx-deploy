import type { Permission } from "@/lib/permissions";

export type RouteIcon =
  | "activity"
  | "ask"
  | "book"
  | "chart"
  | "dashboard"
  | "gaps"
  | "memory"
  | "shield"
  | "spark"
  | "titan"
  | "users";

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
