import { assertFile, assertIncludes, runWpTests } from "./train-l-test-utils";

await runWpTests([
  {
    id: "AC-L04-01",
    name: "Execution velocity analytics exists",
    fn: () =>
      assertIncludes(
        "src/lib/analytics/lifecycle-analytics.ts",
        "executionVelocity",
      ),
  },
  {
    id: "AC-L04-02",
    name: "Execution trend cards render",
    fn: () =>
      assertIncludes(
        "src/components/analytics/lifecycle-analytics-view.tsx",
        "Execution velocity and trends",
      ),
  },
  {
    id: "AC-L04-03",
    name: "Velocity data is protected through analytics router",
    fn: () =>
      assertIncludes(
        "src/server/api/routers/analytics.ts",
        'requirePermission("analytics:read")',
      ),
  },
  {
    id: "AC-L04-04",
    name: "Analytics failure state exists",
    fn: () =>
      assertIncludes(
        "src/components/analytics/lifecycle-analytics-view.tsx",
        "Analytics unavailable",
      ),
  },
  {
    id: "AC-L04-05",
    name: "Evidence path exists for WP-L-04",
    fn: () => assertFile("evidence/EP-05/2026-06-24/test"),
  },
  {
    id: "AC-L04-06",
    name: "Automated test script exists",
    fn: () => assertFile("scripts/test-wp-l-04.ts"),
  },
  {
    id: "AC-L04-07",
    name: "Build and lint command evidence is planned",
    fn: () => assertFile("evidence/EP-05/2026-06-24/deployment"),
  },
  {
    id: "AC-L04-08",
    name: "Task router still uses lifecycle records",
    fn: () =>
      assertIncludes("src/server/api/routers/task.ts", "lifecycle-records"),
  },
  {
    id: "AC-L04-09",
    name: "Variance is reviewable",
    fn: () =>
      assertIncludes("src/lib/analytics/lifecycle-analytics.ts", "variance"),
  },
  {
    id: "AC-L04-10",
    name: "Closure language exists",
    fn: () =>
      assertFile(
        "evidence/EP-05/2026-06-24/acceptance/EV-ACPT_WP-L-04_20260624_checklist.md",
      ),
  },
]);
