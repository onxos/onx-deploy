import { assertFile, assertIncludes, runWpTests } from "./train-m-test-utils";

await runWpTests([
  {
    id: "AC-M04-01",
    name: "Flourishing timeline exists",
    fn: () =>
      assertIncludes(
        "src/lib/outcomes/outcome-records.ts",
        "flourishingTimeline",
      ),
  },
  {
    id: "AC-M04-02",
    name: "Flourishing page renders timeline",
    fn: () =>
      assertIncludes(
        "src/components/outcomes/flourishing-view.tsx",
        "Flourishing timeline",
      ),
  },
  {
    id: "AC-M04-03",
    name: "Flourishing data is protected",
    fn: () =>
      assertIncludes(
        "src/components/outcomes/flourishing-view.tsx",
        "api.outcome.getReviewSummary.useQuery",
      ),
  },
  {
    id: "AC-M04-04",
    name: "Timeline failure state exists",
    fn: () =>
      assertIncludes(
        "src/components/outcomes/flourishing-view.tsx",
        "Timeline unavailable",
      ),
  },
  {
    id: "AC-M04-05",
    name: "Evidence path exists",
    fn: () => assertFile("evidence/EP-05/2026-06-24/test"),
  },
  {
    id: "AC-M04-06",
    name: "Automated test exists",
    fn: () => assertFile("scripts/test-wp-m-04.ts"),
  },
  {
    id: "AC-M04-07",
    name: "Deployment evidence path exists",
    fn: () => assertFile("evidence/EP-05/2026-06-24/deployment"),
  },
  {
    id: "AC-M04-08",
    name: "Route config includes flourishing",
    fn: () => assertIncludes("src/config/routes.ts", "/flourishing"),
  },
  {
    id: "AC-M04-09",
    name: "Personal and institutional scopes are reviewable",
    fn: () =>
      assertIncludes("src/lib/outcomes/outcome-records.ts", "institutional"),
  },
  {
    id: "AC-M04-10",
    name: "Closure checklist exists",
    fn: () =>
      assertFile(
        "evidence/EP-05/2026-06-24/acceptance/EV-ACPT_WP-M-04_20260624_checklist.md",
      ),
  },
]);
