import { assertIncludes, runWpTests } from "./train-k-test-utils";

await runWpTests([
  {
    id: "AC-K04-01",
    name: "Workspace tabs",
    fn: () =>
      assertIncludes(
        "src/components/workspace/workspace-layout.tsx",
        "Understanding tab",
      ),
  },
  {
    id: "AC-K04-02",
    name: "Understanding cards",
    fn: () =>
      assertIncludes(
        "src/components/workspace/understanding-card.tsx",
        "research",
      ),
  },
  {
    id: "AC-K04-03",
    name: "Judgment cards",
    fn: () =>
      assertIncludes("src/components/workspace/judgment-card.tsx", "verdict"),
  },
  {
    id: "AC-K04-04",
    name: "Understanding validation",
    fn: () =>
      assertIncludes("src/lib/validations/workspace.ts", "understandingSchema"),
  },
  {
    id: "AC-K04-05",
    name: "Judgment validation",
    fn: () =>
      assertIncludes("src/lib/validations/workspace.ts", "judgmentSchema"),
  },
  {
    id: "AC-K04-06",
    name: "Confidence badge",
    fn: () =>
      assertIncludes(
        "src/components/workspace/confidence-badge.tsx",
        "Certain",
      ),
  },
  {
    id: "AC-K04-07",
    name: "Parent links",
    fn: () =>
      assertIncludes("src/components/workspace/judgment-card.tsx", "Linked"),
  },
  {
    id: "AC-K04-08",
    name: "Type filter",
    fn: () =>
      assertIncludes(
        "src/components/workspace/workspace-filters.tsx",
        "setType",
      ),
  },
  {
    id: "AC-K04-09",
    name: "Confidence filter",
    fn: () =>
      assertIncludes(
        "src/components/workspace/workspace-filters.tsx",
        "setConfidence",
      ),
  },
  {
    id: "AC-K04-10",
    name: "Empty state",
    fn: () =>
      assertIncludes(
        "src/components/workspace/judgment-list.tsx",
        "Empty state",
      ),
  },
]);
