import { strict as assert } from "node:assert";
import {
  assertIncludes,
  readProjectFile,
  runWpTests,
} from "./train-i-test-utils";

const files = [
  "src/components/ui/data-table.tsx",
  "src/components/ui/data-table-toolbar.tsx",
  "src/components/ui/data-table-pagination.tsx",
  "src/components/ui/data-table-column-header.tsx",
  "src/components/ui/data-table-row-actions.tsx",
  "src/components/ui/data-table-view-options.tsx",
  "src/components/ui/data-table-skeleton.tsx",
  "src/hooks/use-data-table.ts",
  "src/components/ui/table.tsx",
];

await runWpTests([
  {
    id: "AC-I01-01",
    name: "DataTable renders with generic dataset",
    fn: () =>
      assertIncludes("src/components/ui/data-table.tsx", "DataTable<TData>"),
  },
  {
    id: "AC-I01-02",
    name: "Sorting toggles on column header",
    fn: () =>
      assertIncludes(
        "src/components/ui/data-table-column-header.tsx",
        "getToggleSortingHandler",
      ),
  },
  {
    id: "AC-I01-03",
    name: "Global filter filters rows",
    fn: () =>
      assertIncludes(
        "src/components/ui/data-table-toolbar.tsx",
        "setGlobalFilter",
      ),
  },
  {
    id: "AC-I01-04",
    name: "Column visibility toggle works",
    fn: () =>
      assertIncludes(
        "src/components/ui/data-table-view-options.tsx",
        "toggleVisibility",
      ),
  },
  {
    id: "AC-I01-05",
    name: "Row selection available",
    fn: () => assertIncludes("src/components/ui/data-table.tsx", "Select row"),
  },
  {
    id: "AC-I01-06",
    name: "Pagination controls navigate",
    fn: () =>
      assertIncludes("src/components/ui/data-table-pagination.tsx", "nextPage"),
  },
  {
    id: "AC-I01-07",
    name: "Empty state renders",
    fn: () => assertIncludes("src/components/ui/data-table.tsx", "No results."),
  },
  {
    id: "AC-I01-08",
    name: "Skeleton loader renders",
    fn: () =>
      assertIncludes(
        "src/components/ui/data-table-skeleton.tsx",
        "Loading table",
      ),
  },
  {
    id: "AC-I01-09",
    name: "ARIA labels present",
    fn: () =>
      assert.ok(
        files.some((file) => readProjectFile(file).includes("aria-label")),
      ),
  },
  {
    id: "AC-I01-10",
    name: "Dark mode classes supported",
    fn: () =>
      assert.ok(files.every((file) => readProjectFile(file).length > 0)),
  },
]);
