import { assertIncludes, runWpTests } from "./train-k-test-utils";

await runWpTests([
  {
    id: "AC-K05-01",
    name: "Execution page renders",
    fn: () =>
      assertIncludes(
        "src/app/(dashboard)/execution/page.tsx",
        "Execution Tracker",
      ),
  },
  {
    id: "AC-K05-02",
    name: "Task DataTable",
    fn: () =>
      assertIncludes("src/components/execution/task-list.tsx", "DataTable"),
  },
  {
    id: "AC-K05-03",
    name: "Task status badge",
    fn: () =>
      assertIncludes(
        "src/components/execution/task-status-badge.tsx",
        "in-progress",
      ),
  },
  {
    id: "AC-K05-04",
    name: "Status toggle",
    fn: () =>
      assertIncludes("src/components/execution/task-card.tsx", "Status toggle"),
  },
  {
    id: "AC-K05-05",
    name: "Timeline ordered",
    fn: () => assertIncludes("src/hooks/use-execution.ts", "sort"),
  },
  {
    id: "AC-K05-06",
    name: "Progress summary",
    fn: () =>
      assertIncludes(
        "src/components/execution/progress-summary.tsx",
        "Completed",
      ),
  },
  {
    id: "AC-K05-07",
    name: "Outcome form",
    fn: () =>
      assertIncludes(
        "src/components/execution/outcome-form.tsx",
        "Outcome recording form",
      ),
  },
  {
    id: "AC-K05-08",
    name: "Overdue warning",
    fn: () =>
      assertIncludes(
        "src/components/execution/task-card.tsx",
        "Overdue warning",
      ),
  },
  {
    id: "AC-K05-09",
    name: "Status filter",
    fn: () =>
      assertIncludes(
        "src/components/execution/execution-filters.tsx",
        "setStatus",
      ),
  },
  {
    id: "AC-K05-10",
    name: "Empty state",
    fn: () =>
      assertIncludes("src/components/execution/task-list.tsx", "Empty state"),
  },
]);
