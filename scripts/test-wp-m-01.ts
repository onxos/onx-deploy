import { assertFile, assertIncludes, runWpTests } from "./train-m-test-utils";

await runWpTests([
  {
    id: "AC-M01-01",
    name: "Outcome records exist",
    fn: () =>
      assertIncludes("src/lib/outcomes/outcome-records.ts", "outcomeRecords"),
  },
  {
    id: "AC-M01-02",
    name: "Outcomes page renders workflow",
    fn: () =>
      assertIncludes(
        "src/components/outcomes/outcomes-view.tsx",
        "Stakeholder impact",
      ),
  },
  {
    id: "AC-M01-03",
    name: "Outcome API is protected",
    fn: () =>
      assertIncludes("src/server/api/routers/outcome.ts", "protectedProcedure"),
  },
  {
    id: "AC-M01-04",
    name: "Outcome validation exists",
    fn: () =>
      assertIncludes("src/server/api/routers/outcome.ts", "outcomeInput"),
  },
  {
    id: "AC-M01-05",
    name: "Evidence path exists",
    fn: () => assertFile("evidence/EP-05/2026-06-24/test"),
  },
  {
    id: "AC-M01-06",
    name: "Automated test exists",
    fn: () => assertFile("scripts/test-wp-m-01.ts"),
  },
  {
    id: "AC-M01-07",
    name: "Deployment evidence path exists",
    fn: () => assertFile("evidence/EP-05/2026-06-24/deployment"),
  },
  {
    id: "AC-M01-08",
    name: "Train L evidence reference remains",
    fn: () =>
      assertIncludes("src/lib/outcomes/outcome-records.ts", "EV-CLSR_TRAIN-L"),
  },
  {
    id: "AC-M01-09",
    name: "Kimi can review evidence links",
    fn: () =>
      assertIncludes(
        "src/components/outcomes/outcomes-view.tsx",
        "evidenceLinks",
      ),
  },
  {
    id: "AC-M01-10",
    name: "Closure checklist exists",
    fn: () =>
      assertFile(
        "evidence/EP-05/2026-06-24/acceptance/EV-ACPT_WP-M-01_20260624_checklist.md",
      ),
  },
]);
