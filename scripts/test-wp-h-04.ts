import { fileExists, includes, runWpTest } from "./train-h-test-utils";

runWpTest("WP-H-04", [
  {
    id: "01",
    description: "Dashboard route exists",
    pass: fileExists("src/app/dashboard/page.tsx"),
  },
  {
    id: "02",
    description: "Stat cards read real tRPC data",
    pass: includes(
      "src/app/dashboard/page.tsx",
      "api.civilization.listArticles.useQuery",
    ),
  },
  {
    id: "03",
    description: "Change indicator colors positive and negative",
    pass:
      includes("src/components/dashboard/stat-card.tsx", "text-emerald-700") &&
      includes("src/components/dashboard/stat-card.tsx", "text-destructive"),
  },
  {
    id: "04",
    description: "Activity feed shows timestamped events",
    pass: includes("src/components/dashboard/activity-feed.tsx", "<time"),
  },
  {
    id: "05",
    description: "Quick actions link to feature pages",
    pass: includes("src/components/dashboard/quick-actions.tsx", "href"),
  },
  {
    id: "06",
    description: "Dashboard skeleton exists",
    pass: fileExists("src/components/dashboard/dashboard-skeleton.tsx"),
  },
  {
    id: "07",
    description: "Empty state exists",
    pass: fileExists("src/components/dashboard/empty-state.tsx"),
  },
  {
    id: "08",
    description: "Widget grid is responsive",
    pass: includes(
      "src/components/dashboard/widget-grid.tsx",
      "ResponsiveGrid",
    ),
  },
  {
    id: "09",
    description: "Dashboard handles partial tRPC errors",
    pass: includes("src/app/dashboard/page.tsx", "hasError"),
  },
  {
    id: "10",
    description: "Root route redirects to dashboard",
    pass: includes("src/app/page.tsx", 'redirect("/dashboard")'),
  },
]);
