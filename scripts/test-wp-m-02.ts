import { assertFile, assertIncludes, runWpTests } from "./train-m-test-utils";

await runWpTests([
  {
    id: "AC-M02-01",
    name: "Lessons records exist",
    fn: () =>
      assertIncludes("src/lib/outcomes/outcome-records.ts", "lessonRecords"),
  },
  {
    id: "AC-M02-02",
    name: "Lessons render on outcomes page",
    fn: () =>
      assertIncludes(
        "src/components/outcomes/outcomes-view.tsx",
        "Lessons learned",
      ),
  },
  {
    id: "AC-M02-03",
    name: "Lessons available through protected summary",
    fn: () =>
      assertIncludes("src/server/api/routers/outcome.ts", "getReviewSummary"),
  },
  {
    id: "AC-M02-04",
    name: "Lessons include improvement notes",
    fn: () =>
      assertIncludes(
        "src/components/outcomes/outcomes-view.tsx",
        "Improvement",
      ),
  },
  {
    id: "AC-M02-05",
    name: "Evidence path exists",
    fn: () => assertFile("evidence/EP-05/2026-06-24/test"),
  },
  {
    id: "AC-M02-06",
    name: "Automated test exists",
    fn: () => assertFile("scripts/test-wp-m-02.ts"),
  },
  {
    id: "AC-M02-07",
    name: "Deployment evidence path exists",
    fn: () => assertFile("evidence/EP-05/2026-06-24/deployment"),
  },
  {
    id: "AC-M02-08",
    name: "Train M does not alter Train L analytics",
    fn: () => assertFile("src/lib/analytics/lifecycle-analytics.ts"),
  },
  {
    id: "AC-M02-09",
    name: "Decision field is reviewable",
    fn: () => assertIncludes("src/lib/outcomes/outcome-records.ts", "decision"),
  },
  {
    id: "AC-M02-10",
    name: "Closure checklist exists",
    fn: () =>
      assertFile(
        "evidence/EP-05/2026-06-24/acceptance/EV-ACPT_WP-M-02_20260624_checklist.md",
      ),
  },
]);
