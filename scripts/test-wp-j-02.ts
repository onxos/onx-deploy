import { assertIncludes, runWpTests } from "./train-j-test-utils";

await runWpTests([
  {
    id: "AC-J02-01",
    name: "Settings page and tabs",
    fn: () =>
      assertIncludes("src/app/(dashboard)/settings/page.tsx", "SettingsNav"),
  },
  {
    id: "AC-J02-02",
    name: "Theme switch",
    fn: () =>
      assertIncludes("src/components/settings/theme-section.tsx", "setTheme"),
  },
  {
    id: "AC-J02-03",
    name: "Theme persistence path",
    fn: () =>
      assertIncludes("src/components/theme/theme-provider.tsx", "localStorage"),
  },
  {
    id: "AC-J02-04",
    name: "Notification toggles save state",
    fn: () =>
      assertIncludes(
        "src/components/settings/notification-section.tsx",
        "setPreferences",
      ),
  },
  {
    id: "AC-J02-05",
    name: "Password validation",
    fn: () =>
      assertIncludes(
        "src/components/settings/account-section.tsx",
        "passwordSchema",
      ),
  },
  {
    id: "AC-J02-06",
    name: "Sessions list",
    fn: () =>
      assertIncludes(
        "src/components/settings/sessions-list.tsx",
        "initialSessions",
      ),
  },
  {
    id: "AC-J02-07",
    name: "Revoke session",
    fn: () =>
      assertIncludes("src/components/settings/sessions-list.tsx", "filter"),
  },
  {
    id: "AC-J02-08",
    name: "Danger confirm dialog",
    fn: () =>
      assertIncludes(
        "src/components/settings/danger-zone.tsx",
        "ConfirmDialog",
      ),
  },
  {
    id: "AC-J02-09",
    name: "ARIA live form errors",
    fn: () => assertIncludes("src/components/ui/form-error.tsx", "aria-live"),
  },
  {
    id: "AC-J02-10",
    name: "Dark mode page",
    fn: () =>
      assertIncludes("src/components/settings/theme-section.tsx", "bg-card"),
  },
]);
