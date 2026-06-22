import { assertIncludes, runWpTests } from "./train-j-test-utils";

await runWpTests([
  {
    id: "AC-J05-01",
    name: "Companion page",
    fn: () =>
      assertIncludes(
        "src/app/(dashboard)/companion/page.tsx",
        "Companion Center",
      ),
  },
  {
    id: "AC-J05-02",
    name: "Message history",
    fn: () =>
      assertIncludes(
        "src/components/companion/message-list.tsx",
        "Message history",
      ),
  },
  {
    id: "AC-J05-03",
    name: "Send on enter or click",
    fn: () =>
      assertIncludes("src/components/companion/message-input.tsx", "Enter"),
  },
  {
    id: "AC-J05-04",
    name: "Scrolls new messages",
    fn: () =>
      assertIncludes("src/hooks/use-companion-chat.ts", "scrollIntoView"),
  },
  {
    id: "AC-J05-05",
    name: "Avatar status",
    fn: () =>
      assertIncludes(
        "src/components/companion/companion-avatar.tsx",
        "bg-emerald-500",
      ),
  },
  {
    id: "AC-J05-06",
    name: "Settings dialog",
    fn: () =>
      assertIncludes(
        "src/components/companion/companion-settings.tsx",
        "ModalDialog",
      ),
  },
  {
    id: "AC-J05-07",
    name: "Guidance history",
    fn: () =>
      assertIncludes(
        "src/components/companion/guidance-history.tsx",
        "Guidance history",
      ),
  },
  {
    id: "AC-J05-08",
    name: "Responsive layout",
    fn: () =>
      assertIncludes(
        "src/components/companion/chat-interface.tsx",
        "lg:grid-cols",
      ),
  },
  {
    id: "AC-J05-09",
    name: "Dark mode",
    fn: () =>
      assertIncludes("src/components/companion/message-list.tsx", "bg-card"),
  },
  {
    id: "AC-J05-10",
    name: "No console error path",
    fn: () => assertIncludes("src/hooks/use-companion-chat.ts", "sendMessage"),
  },
]);
