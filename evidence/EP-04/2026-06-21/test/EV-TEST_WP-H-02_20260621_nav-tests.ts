import { fileExists, includes, runWpTest } from "./train-h-test-utils";

runWpTest("WP-H-02", [
  {
    id: "01",
    description: "Route config is present",
    pass: fileExists("src/config/routes.ts"),
  },
  {
    id: "02",
    description: "Nav menu renders route groups",
    pass: includes("src/components/layout/nav-menu.tsx", "groupedRoutes"),
  },
  {
    id: "03",
    description: "Permission hook filters nav items",
    pass: includes("src/hooks/use-nav-permissions.ts", "hasPermission"),
  },
  {
    id: "04",
    description: "Mobile drawer has overlay",
    pass: includes(
      "src/components/layout/mobile-drawer.tsx",
      "bg-foreground/30",
    ),
  },
  {
    id: "05",
    description: "Breadcrumb derives pathname",
    pass: includes("src/components/layout/breadcrumb.tsx", "usePathname"),
  },
  {
    id: "06",
    description: "User menu exposes role and logout",
    pass:
      includes("src/components/layout/user-menu.tsx", "role") &&
      includes("src/components/layout/user-menu.tsx", "Log out"),
  },
  {
    id: "07",
    description: "Collapsed sidebar passes icon-only state",
    pass: includes("src/components/layout/sidebar.tsx", "isCollapsed"),
  },
  {
    id: "08",
    description: "External route target behavior is supported",
    pass: includes(
      "src/components/layout/nav-item.tsx",
      "target={route.external",
    ),
  },
  {
    id: "09",
    description: "Nav sections collapse and expand",
    pass: includes("src/components/layout/nav-section.tsx", "setIsOpen"),
  },
  {
    id: "10",
    description: "Keyboard escape closes drawer",
    pass: includes("src/components/layout/mobile-drawer.tsx", "Escape"),
  },
]);
