import { assertIncludes, runWpTests } from "./train-j-test-utils";

await runWpTests([
  {
    id: "AC-J04-01",
    name: "Institution page",
    fn: () =>
      assertIncludes(
        "src/app/(dashboard)/institution/page.tsx",
        "Institution Overview",
      ),
  },
  {
    id: "AC-J04-02",
    name: "Member DataTable",
    fn: () =>
      assertIncludes(
        "src/components/institution/member-table.tsx",
        "DataTable",
      ),
  },
  {
    id: "AC-J04-03",
    name: "Role distribution",
    fn: () =>
      assertIncludes(
        "src/components/institution/role-distribution.tsx",
        "Object.entries",
      ),
  },
  {
    id: "AC-J04-04",
    name: "Member drawer",
    fn: () =>
      assertIncludes(
        "src/components/institution/member-drawer.tsx",
        "ModalDialog",
      ),
  },
  {
    id: "AC-J04-05",
    name: "Activity colors",
    fn: () =>
      assertIncludes(
        "src/components/institution/activity-indicator.tsx",
        "emerald",
      ),
  },
  {
    id: "AC-J04-06",
    name: "Search filters",
    fn: () => assertIncludes("src/hooks/use-institution.ts", "setQuery"),
  },
  {
    id: "AC-J04-07",
    name: "Role filters",
    fn: () => assertIncludes("src/hooks/use-institution.ts", "roleFilter"),
  },
  {
    id: "AC-J04-08",
    name: "Stats cards",
    fn: () =>
      assertIncludes(
        "src/components/institution/institution-stats.tsx",
        "totalMembers",
      ),
  },
  {
    id: "AC-J04-09",
    name: "Responsive layout",
    fn: () =>
      assertIncludes(
        "src/app/(dashboard)/institution/page.tsx",
        "md:grid-cols",
      ),
  },
  {
    id: "AC-J04-10",
    name: "Dark mode aware",
    fn: () =>
      assertIncludes(
        "src/components/institution/institution-stats.tsx",
        "bg-card",
      ),
  },
]);
