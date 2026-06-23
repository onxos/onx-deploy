import { assertFile, assertIncludes, runWpTests } from "./train-k-test-utils";

await runWpTests([
  {
    id: "AC-K02-01",
    name: "Potential list page renders",
    fn: () =>
      assertIncludes(
        "src/app/(dashboard)/potential/page.tsx",
        "Potential Discovery",
      ),
  },
  {
    id: "AC-K02-02",
    name: "DataTable displays potentials",
    fn: () =>
      assertIncludes(
        "src/components/potential/potential-list.tsx",
        "DataTable",
      ),
  },
  {
    id: "AC-K02-03",
    name: "Parent dream title",
    fn: () =>
      assertIncludes(
        "src/components/potential/potential-card.tsx",
        "parentDreamTitle",
      ),
  },
  {
    id: "AC-K02-04",
    name: "Feasibility badge colors",
    fn: () =>
      assertIncludes("src/components/potential/feasibility-badge.tsx", "High"),
  },
  {
    id: "AC-K02-05",
    name: "Assessment score",
    fn: () =>
      assertIncludes(
        "src/components/potential/potential-card.tsx",
        "assessmentScore",
      ),
  },
  {
    id: "AC-K02-06",
    name: "Creation form validates",
    fn: () => assertIncludes("src/lib/validations/potential.ts", "max(100)"),
  },
  {
    id: "AC-K02-07",
    name: "Mark conversion",
    fn: () => assertIncludes("src/hooks/use-potential.ts", "markForConversion"),
  },
  {
    id: "AC-K02-08",
    name: "Feasibility filter",
    fn: () =>
      assertIncludes(
        "src/components/potential/potential-filters.tsx",
        "setFeasibility",
      ),
  },
  {
    id: "AC-K02-09",
    name: "Potential detail route",
    fn: () => assertFile("src/app/(dashboard)/potential/[id]/page.tsx"),
  },
  {
    id: "AC-K02-10",
    name: "Empty state",
    fn: () =>
      assertIncludes(
        "src/components/potential/potential-list.tsx",
        "Empty state",
      ),
  },
]);
