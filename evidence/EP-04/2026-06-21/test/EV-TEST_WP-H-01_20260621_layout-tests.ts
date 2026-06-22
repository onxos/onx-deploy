import { fileExists, includes, runWpTest } from "./train-h-test-utils";

runWpTest("WP-H-01", [
  {
    id: "01",
    description: "AppShell component exists",
    pass: fileExists("src/components/layout/app-shell.tsx"),
  },
  {
    id: "02",
    description: "Root layout wraps children with AppShell",
    pass: includes("src/app/layout.tsx", "<AppShell>{children}</AppShell>"),
  },
  {
    id: "03",
    description: "Sidebar visible on desktop via md:flex",
    pass: includes("src/components/layout/sidebar.tsx", "md:flex"),
  },
  {
    id: "04",
    description: "Topbar is sticky",
    pass: includes("src/components/layout/topbar.tsx", "sticky top-0"),
  },
  {
    id: "05",
    description: "Content area scrolls independently",
    pass: includes("src/components/layout/content-area.tsx", "overflow-y-auto"),
  },
  {
    id: "06",
    description: "Mobile drawer exists",
    pass: fileExists("src/components/layout/mobile-drawer.tsx"),
  },
  {
    id: "07",
    description: "Error boundary fallback exists",
    pass: fileExists("src/components/layout/error-boundary.tsx"),
  },
  {
    id: "08",
    description: "Global loading route exists",
    pass: fileExists("src/app/loading.tsx"),
  },
  {
    id: "09",
    description: "404 page exists",
    pass: fileExists("src/app/not-found.tsx"),
  },
  {
    id: "10",
    description: "PageWrapper supports actions",
    pass: includes("src/components/layout/page-wrapper.tsx", "actions"),
  },
]);
