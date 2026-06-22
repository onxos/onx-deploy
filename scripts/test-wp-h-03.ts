import { fileExists, includes, read, runWpTest } from "./train-h-test-utils";

const grid = read("src/components/layout/responsive-grid.tsx");

runWpTest("WP-H-03", [
  {
    id: "01",
    description: "Breakpoint helper returns named breakpoints",
    pass: includes("src/lib/breakpoints.ts", "getBreakpointName"),
  },
  {
    id: "02",
    description: "Sidebar collapses at tablet width",
    pass: includes(
      "src/components/layout/collapsible-sidebar.tsx",
      'breakpoint === "md"',
    ),
  },
  {
    id: "03",
    description: "Sidebar hidden and drawer available on mobile",
    pass:
      includes("src/components/layout/sidebar.tsx", "hidden") &&
      includes("src/components/layout/mobile-menu-trigger.tsx", "md:hidden"),
  },
  {
    id: "04",
    description: "Touch targets use minimum 44px height",
    pass: read("src/components/layout/nav-item.tsx").includes("min-h-11"),
  },
  {
    id: "05",
    description: "Grid adapts 1/2/3/4 columns",
    pass:
      grid.includes("grid-cols-1") &&
      grid.includes("md:grid-cols-2") &&
      grid.includes("lg:grid-cols-3") &&
      grid.includes("xl:grid-cols-4"),
  },
  {
    id: "06",
    description: "Shell prevents horizontal viewport overflow",
    pass: includes("src/components/layout/app-shell.tsx", "overflow-hidden"),
  },
  {
    id: "07",
    description: "Font size scales through responsive classes",
    pass: includes("src/components/layout/page-wrapper.tsx", "md:text-3xl"),
  },
  {
    id: "08",
    description: "Content max width is enforced",
    pass: includes("src/components/layout/page-wrapper.tsx", "max-w-7xl"),
  },
  {
    id: "09",
    description: "Media query stylesheet exists",
    pass: fileExists("src/styles/media-queries.css"),
  },
  {
    id: "10",
    description: "Generic media query hook exists",
    pass: fileExists("src/hooks/use-media-query.ts"),
  },
]);
