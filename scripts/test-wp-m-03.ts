import { assertFile, assertIncludes, runWpTests } from "./train-m-test-utils";

await runWpTests([
  {
    id: "AC-M03-01",
    name: "Recognition badges exist",
    fn: () =>
      assertIncludes(
        "src/lib/outcomes/outcome-records.ts",
        "recognitionBadges",
      ),
  },
  {
    id: "AC-M03-02",
    name: "Recognition page renders badges",
    fn: () =>
      assertIncludes(
        "src/components/outcomes/recognition-view.tsx",
        "Achievement badges",
      ),
  },
  {
    id: "AC-M03-03",
    name: "Recognition data is protected",
    fn: () =>
      assertIncludes(
        "src/components/outcomes/recognition-view.tsx",
        "api.outcome.getReviewSummary.useQuery",
      ),
  },
  {
    id: "AC-M03-04",
    name: "Recognition failure state exists",
    fn: () =>
      assertIncludes(
        "src/components/outcomes/recognition-view.tsx",
        "Recognition unavailable",
      ),
  },
  {
    id: "AC-M03-05",
    name: "Evidence path exists",
    fn: () => assertFile("evidence/EP-05/2026-06-24/test"),
  },
  {
    id: "AC-M03-06",
    name: "Automated test exists",
    fn: () => assertFile("scripts/test-wp-m-03.ts"),
  },
  {
    id: "AC-M03-07",
    name: "Deployment evidence path exists",
    fn: () => assertFile("evidence/EP-05/2026-06-24/deployment"),
  },
  {
    id: "AC-M03-08",
    name: "Routes preserve previous route config",
    fn: () => assertIncludes("src/config/routes.ts", "/recognition"),
  },
  {
    id: "AC-M03-09",
    name: "Badge signal is reviewable",
    fn: () =>
      assertIncludes(
        "src/components/outcomes/recognition-view.tsx",
        "badge.signal",
      ),
  },
  {
    id: "AC-M03-10",
    name: "Closure checklist exists",
    fn: () =>
      assertFile(
        "evidence/EP-05/2026-06-24/acceptance/EV-ACPT_WP-M-03_20260624_checklist.md",
      ),
  },
]);
