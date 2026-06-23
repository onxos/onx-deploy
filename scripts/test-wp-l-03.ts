import { assertFile, assertIncludes, runWpTests } from "./train-l-test-utils";

await runWpTests([
  {
    id: "AC-L03-01",
    name: "Goal progress analytics exists",
    fn: () =>
      assertIncludes(
        "src/lib/analytics/lifecycle-analytics.ts",
        "goalProgress",
      ),
  },
  {
    id: "AC-L03-02",
    name: "Progress charts render",
    fn: () =>
      assertIncludes(
        "src/components/analytics/lifecycle-analytics-view.tsx",
        "Goal progress charts",
      ),
  },
  {
    id: "AC-L03-03",
    name: "Protected analytics route is used",
    fn: () =>
      assertIncludes(
        "src/server/api/routers/analytics.ts",
        "getLifecycleSummary",
      ),
  },
  {
    id: "AC-L03-04",
    name: "Progress handles empty goal data",
    fn: () =>
      assertIncludes(
        "src/components/analytics/lifecycle-analytics-view.tsx",
        "No analytics data",
      ),
  },
  {
    id: "AC-L03-05",
    name: "Evidence path exists for WP-L-03",
    fn: () => assertFile("evidence/EP-05/2026-06-24/test"),
  },
  {
    id: "AC-L03-06",
    name: "Automated test script exists",
    fn: () => assertFile("scripts/test-wp-l-03.ts"),
  },
  {
    id: "AC-L03-07",
    name: "Build and lint command evidence is planned",
    fn: () => assertFile("evidence/EP-05/2026-06-24/deployment"),
  },
  {
    id: "AC-L03-08",
    name: "Goal router still uses lifecycle records",
    fn: () =>
      assertIncludes("src/server/api/routers/goal.ts", "lifecycle-records"),
  },
  {
    id: "AC-L03-09",
    name: "Milestone progress is reviewable",
    fn: () =>
      assertIncludes(
        "src/lib/analytics/lifecycle-analytics.ts",
        "milestoneProgress",
      ),
  },
  {
    id: "AC-L03-10",
    name: "Closure language exists",
    fn: () =>
      assertFile(
        "evidence/EP-05/2026-06-24/acceptance/EV-ACPT_WP-L-03_20260624_checklist.md",
      ),
  },
]);
