import { assertFile, assertIncludes, runWpTests } from "./train-l-test-utils";

await runWpTests([
  {
    id: "AC-L01-01",
    name: "Dashboard KPI implementation exists",
    fn: () => assertFile("src/app/dashboard/page.tsx"),
  },
  {
    id: "AC-L01-02",
    name: "Dashboard uses lifecycle analytics source",
    fn: () =>
      assertIncludes("src/app/dashboard/page.tsx", "getLifecycleSummary"),
  },
  {
    id: "AC-L01-03",
    name: "Protected analytics procedure enforces RBAC",
    fn: () =>
      assertIncludes(
        "src/server/api/routers/analytics.ts",
        'requirePermission("analytics:read")',
      ),
  },
  {
    id: "AC-L01-04",
    name: "Dashboard loading and error states exist",
    fn: () => assertIncludes("src/app/dashboard/page.tsx", "hasError"),
  },
  {
    id: "AC-L01-05",
    name: "Evidence path exists for WP-L-01",
    fn: () => assertFile("evidence/EP-05/2026-06-24/test"),
  },
  {
    id: "AC-L01-06",
    name: "Automated test script exists",
    fn: () => assertFile("scripts/test-wp-l-01.ts"),
  },
  {
    id: "AC-L01-07",
    name: "Build and lint command evidence is planned",
    fn: () => assertFile("evidence/EP-05/2026-06-24/deployment"),
  },
  {
    id: "AC-L01-08",
    name: "Earlier lifecycle records are shared, not weakened",
    fn: () => assertFile("src/lib/civilization/lifecycle-records.ts"),
  },
  {
    id: "AC-L01-09",
    name: "Dashboard has reviewable KPI labels",
    fn: () =>
      assertIncludes("src/app/dashboard/page.tsx", "Completion velocity"),
  },
  {
    id: "AC-L01-10",
    name: "Closure language exists",
    fn: () =>
      assertFile(
        "evidence/EP-05/2026-06-24/acceptance/EV-ACPT_WP-L-01_20260624_checklist.md",
      ),
  },
]);
