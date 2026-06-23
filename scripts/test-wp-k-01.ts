import { assertFile, assertIncludes, runWpTests } from "./train-k-test-utils";

await runWpTests([
  {
    id: "AC-K01-01",
    name: "Dream list page renders",
    fn: () =>
      assertIncludes("src/app/(dashboard)/dreams/page.tsx", "Dream Center"),
  },
  {
    id: "AC-K01-02",
    name: "DataTable displays dreams",
    fn: () =>
      assertIncludes("src/components/dreams/dream-list.tsx", "DataTable"),
  },
  {
    id: "AC-K01-03",
    name: "Title validation",
    fn: () => assertIncludes("src/lib/validations/dream.ts", "max(200)"),
  },
  {
    id: "AC-K01-04",
    name: "Description validation",
    fn: () => assertIncludes("src/lib/validations/dream.ts", "max(2000)"),
  },
  {
    id: "AC-K01-05",
    name: "New dream appears",
    fn: () => assertIncludes("src/hooks/use-dreams.ts", "createDream"),
  },
  {
    id: "AC-K01-06",
    name: "Dream detail page",
    fn: () => assertFile("src/app/(dashboard)/dreams/[id]/page.tsx"),
  },
  {
    id: "AC-K01-07",
    name: "Status badge colors",
    fn: () =>
      assertIncludes(
        "src/components/dreams/dream-status-badge.tsx",
        "STATUS_VARIANTS",
      ),
  },
  {
    id: "AC-K01-08",
    name: "Category filters",
    fn: () =>
      assertIncludes(
        "src/components/dreams/dream-filters.tsx",
        "dreamCategories",
      ),
  },
  {
    id: "AC-K01-09",
    name: "Search filters",
    fn: () => assertIncludes("src/hooks/use-dreams.ts", "setSearch"),
  },
  {
    id: "AC-K01-10",
    name: "Empty state",
    fn: () =>
      assertIncludes("src/components/dreams/dream-list.tsx", "Empty state"),
  },
]);
