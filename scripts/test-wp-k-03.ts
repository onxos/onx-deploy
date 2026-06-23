import { assertFile, assertIncludes, runWpTests } from "./train-k-test-utils";

await runWpTests([
  {
    id: "AC-K03-01",
    name: "Goal list page renders",
    fn: () =>
      assertIncludes("src/app/(dashboard)/goals/page.tsx", "Goal Realization"),
  },
  {
    id: "AC-K03-02",
    name: "Potential prefill",
    fn: () =>
      assertIncludes("src/components/goals/goal-form.tsx", "fromPotential"),
  },
  {
    id: "AC-K03-03",
    name: "Milestone list",
    fn: () =>
      assertIncludes(
        "src/components/goals/milestone-list.tsx",
        "Milestone list",
      ),
  },
  {
    id: "AC-K03-04",
    name: "Progress indicator",
    fn: () =>
      assertIncludes(
        "src/components/goals/progress-indicator.tsx",
        "Progress indicator",
      ),
  },
  {
    id: "AC-K03-05",
    name: "Goal status badge",
    fn: () =>
      assertIncludes("src/components/goals/goal-status-badge.tsx", "Completed"),
  },
  {
    id: "AC-K03-06",
    name: "Overdue warning",
    fn: () =>
      assertIncludes("src/components/goals/goal-card.tsx", "Overdue warning"),
  },
  {
    id: "AC-K03-07",
    name: "Hierarchy",
    fn: () =>
      assertIncludes("src/components/goals/goal-detail.tsx", "Hierarchy"),
  },
  {
    id: "AC-K03-08",
    name: "Status filter",
    fn: () =>
      assertIncludes("src/components/goals/goal-filters.tsx", "setStatus"),
  },
  {
    id: "AC-K03-09",
    name: "Zod validation",
    fn: () => assertIncludes("src/lib/validations/goal.ts", "invalid deadline"),
  },
  {
    id: "AC-K03-10",
    name: "Empty state and detail route",
    fn: () => {
      assertIncludes("src/components/goals/goal-list.tsx", "Empty state");
      assertFile("src/app/(dashboard)/goals/[id]/page.tsx");
    },
  },
]);
