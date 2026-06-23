import { assertFile, assertIncludes, runWpTests } from "./train-m-test-utils";

await runWpTests([
  {
    id: "AC-M05-01",
    name: "Outcome review summary exists",
    fn: () =>
      assertIncludes(
        "src/lib/outcomes/outcome-records.ts",
        "getOutcomeReviewSummary",
      ),
  },
  {
    id: "AC-M05-02",
    name: "Leadership review cards render",
    fn: () =>
      assertIncludes("src/components/outcomes/recognition-view.tsx", "Quality"),
  },
  {
    id: "AC-M05-03",
    name: "Review data is protected",
    fn: () => assertIncludes("src/server/api/root.ts", "outcome"),
  },
  {
    id: "AC-M05-04",
    name: "Review failure state exists",
    fn: () =>
      assertIncludes(
        "src/components/outcomes/recognition-view.tsx",
        "Recognition unavailable",
      ),
  },
  {
    id: "AC-M05-05",
    name: "Evidence path exists",
    fn: () => assertFile("evidence/EP-05/2026-06-24/test"),
  },
  {
    id: "AC-M05-06",
    name: "Automated test exists",
    fn: () => assertFile("scripts/test-wp-m-05.ts"),
  },
  {
    id: "AC-M05-07",
    name: "Deployment evidence path exists",
    fn: () => assertFile("evidence/EP-05/2026-06-24/deployment"),
  },
  {
    id: "AC-M05-08",
    name: "Outcomes route added without removing prior routes",
    fn: () => assertIncludes("src/config/routes.ts", "/outcomes"),
  },
  {
    id: "AC-M05-09",
    name: "Review metrics are explicit",
    fn: () =>
      assertIncludes("src/lib/outcomes/outcome-records.ts", "averageQuality"),
  },
  {
    id: "AC-M05-10",
    name: "Train M closure exists",
    fn: () =>
      assertFile(
        "evidence/EP-05/2026-06-24/closure/EV-CLSR_TRAIN-M_20260624_final-verification.txt",
      ),
  },
]);
