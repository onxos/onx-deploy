import { assertIncludes, runWpTests } from "./train-j-test-utils";

await runWpTests([
  {
    id: "AC-J03-01",
    name: "Dropdown toggles",
    fn: () =>
      assertIncludes(
        "src/components/notifications/notification-dropdown.tsx",
        "setOpen",
      ),
  },
  {
    id: "AC-J03-02",
    name: "Badge unread count",
    fn: () =>
      assertIncludes(
        "src/components/notifications/notification-badge.tsx",
        "unread notifications",
      ),
  },
  {
    id: "AC-J03-03",
    name: "DataTable notification list",
    fn: () =>
      assertIncludes(
        "src/components/notifications/notification-list.tsx",
        "DataTable",
      ),
  },
  {
    id: "AC-J03-04",
    name: "Read toggle",
    fn: () => assertIncludes("src/hooks/use-notifications.ts", "toggleRead"),
  },
  {
    id: "AC-J03-05",
    name: "Type filter",
    fn: () =>
      assertIncludes(
        "src/components/notifications/notification-filters.tsx",
        "warning",
      ),
  },
  {
    id: "AC-J03-06",
    name: "Mark all read",
    fn: () => assertIncludes("src/hooks/use-notifications.ts", "markAllAsRead"),
  },
  {
    id: "AC-J03-07",
    name: "Empty state",
    fn: () =>
      assertIncludes(
        "src/app/(dashboard)/notifications/page.tsx",
        "No notifications",
      ),
  },
  {
    id: "AC-J03-08",
    name: "Notifications page",
    fn: () =>
      assertIncludes(
        "src/app/(dashboard)/notifications/page.tsx",
        "Notification Center",
      ),
  },
  {
    id: "AC-J03-09",
    name: "Escape closes dropdown",
    fn: () =>
      assertIncludes(
        "src/components/notifications/notification-dropdown.tsx",
        "Escape",
      ),
  },
  {
    id: "AC-J03-10",
    name: "Dark mode aware",
    fn: () =>
      assertIncludes(
        "src/components/notifications/notification-dropdown.tsx",
        "bg-popover",
      ),
  },
]);
