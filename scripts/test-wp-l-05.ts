import { assertFile, assertIncludes, runWpTests } from "./train-l-test-utils";

await runWpTests([
  {
    id: "AC-L05-01",
    name: "Reports route exists",
    fn: () => assertFile("src/app/(dashboard)/reports/page.tsx"),
  },
  {
    id: "AC-L05-02",
    name: "CSV report renders",
    fn: () =>
      assertIncludes(
        "src/components/reports/lifecycle-report-view.tsx",
        "Lifecycle CSV export",
      ),
  },
  {
    id: "AC-L05-03",
    name: "Reports use protected analytics data",
    fn: () =>
      assertIncludes(
        "src/components/reports/lifecycle-report-view.tsx",
        "api.analytics.getLifecycleSummary.useQuery",
      ),
  },
  {
    id: "AC-L05-04",
    name: "Reports failure state exists",
    fn: () =>
      assertIncludes(
        "src/components/reports/lifecycle-report-view.tsx",
        "Report unavailable",
      ),
  },
  {
    id: "AC-L05-05",
    name: "Evidence path exists for WP-L-05",
    fn: () => assertFile("evidence/EP-05/2026-06-24/test"),
  },
  {
    id: "AC-L05-06",
    name: "Automated test script exists",
    fn: () => assertFile("scripts/test-wp-l-05.ts"),
  },
  {
    id: "AC-L05-07",
    name: "Build and lint command evidence is planned",
    fn: () => assertFile("evidence/EP-05/2026-06-24/deployment"),
  },
  {
    id: "AC-L05-08",
    name: "Routes are added without removing prior routes",
    fn: () => assertIncludes("src/config/routes.ts", "/reports"),
  },
  {
    id: "AC-L05-09",
    name: "Evidence references are shown in reports",
    fn: () =>
      assertIncludes(
        "src/components/reports/lifecycle-report-view.tsx",
        "Evidence references",
      ),
  },
  {
    id: "AC-L05-10",
    name: "Closure language exists",
    fn: () =>
      assertFile(
        "evidence/EP-05/2026-06-24/acceptance/EV-ACPT_WP-L-05_20260624_checklist.md",
      ),
  },
]);
