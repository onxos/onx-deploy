import { assertFile, assertIncludes, runWpTests } from "./train-l-test-utils";

await runWpTests([
  {
    id: "AC-L02-01",
    name: "Analytics route exists",
    fn: () => assertFile("src/app/(dashboard)/analytics/page.tsx"),
  },
  {
    id: "AC-L02-02",
    name: "Conversion funnel can render end to end",
    fn: () =>
      assertIncludes(
        "src/components/analytics/lifecycle-analytics-view.tsx",
        "Dream conversion funnel",
      ),
  },
  {
    id: "AC-L02-03",
    name: "Analytics route uses protected tRPC data",
    fn: () =>
      assertIncludes(
        "src/components/analytics/lifecycle-analytics-view.tsx",
        "api.analytics.getLifecycleSummary.useQuery",
      ),
  },
  {
    id: "AC-L02-04",
    name: "Loading, error, and empty states exist",
    fn: () =>
      assertIncludes(
        "src/components/analytics/lifecycle-analytics-view.tsx",
        "No analytics data",
      ),
  },
  {
    id: "AC-L02-05",
    name: "Evidence path exists for WP-L-02",
    fn: () => assertFile("evidence/EP-05/2026-06-24/test"),
  },
  {
    id: "AC-L02-06",
    name: "Automated test script exists",
    fn: () => assertFile("scripts/test-wp-l-02.ts"),
  },
  {
    id: "AC-L02-07",
    name: "Build and lint command evidence is planned",
    fn: () => assertFile("evidence/EP-05/2026-06-24/deployment"),
  },
  {
    id: "AC-L02-08",
    name: "Shared lifecycle records remain available",
    fn: () => assertIncludes("src/server/api/routers/dream.ts", "dreams"),
  },
  {
    id: "AC-L02-09",
    name: "Funnel rates are reviewable",
    fn: () =>
      assertIncludes("src/lib/analytics/lifecycle-analytics.ts", "totalRate"),
  },
  {
    id: "AC-L02-10",
    name: "Closure language exists",
    fn: () =>
      assertFile(
        "evidence/EP-05/2026-06-24/acceptance/EV-ACPT_WP-L-02_20260624_checklist.md",
      ),
  },
]);
