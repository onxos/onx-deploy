import { assertIncludes, runWpTests } from "./train-j-test-utils";

await runWpTests([
  {
    id: "AC-J01-01",
    name: "Profile page renders",
    fn: () =>
      assertIncludes("src/app/(dashboard)/profile/page.tsx", "User Profile"),
  },
  {
    id: "AC-J01-02",
    name: "Avatar fallback initials",
    fn: () =>
      assertIncludes(
        "src/components/profile/avatar-display.tsx",
        "initialsFor",
      ),
  },
  {
    id: "AC-J01-03",
    name: "Role badge color map",
    fn: () =>
      assertIncludes("src/components/profile/role-badge.tsx", "ROLE_COLORS"),
  },
  {
    id: "AC-J01-04",
    name: "Member since date",
    fn: () =>
      assertIncludes("src/components/profile/profile-card.tsx", "Member since"),
  },
  {
    id: "AC-J01-05",
    name: "Edit mode toggles",
    fn: () =>
      assertIncludes("src/app/(dashboard)/profile/page.tsx", "setIsEditing"),
  },
  {
    id: "AC-J01-06",
    name: "Zod profile validation",
    fn: () =>
      assertIncludes(
        "src/components/profile/profile-form.tsx",
        "profileSchema",
      ),
  },
  {
    id: "AC-J01-07",
    name: "Save mutation hook",
    fn: () => assertIncludes("src/hooks/use-profile.ts", "updateProfile"),
  },
  {
    id: "AC-J01-08",
    name: "Cancel reverts",
    fn: () =>
      assertIncludes("src/components/profile/profile-form.tsx", "Cancel"),
  },
  {
    id: "AC-J01-09",
    name: "Dark mode aware",
    fn: () => assertIncludes("src/components/profile/role-badge.tsx", "dark:"),
  },
  {
    id: "AC-J01-10",
    name: "Responsive layout",
    fn: () =>
      assertIncludes("src/components/profile/profile-card.tsx", "sm:flex-row"),
  },
]);
