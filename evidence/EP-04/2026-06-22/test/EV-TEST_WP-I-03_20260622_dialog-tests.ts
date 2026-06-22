import { assertIncludes, runWpTests } from "./train-i-test-utils";

await runWpTests([
  {
    id: "AC-I03-01",
    name: "Alert blocks interaction",
    fn: () =>
      assertIncludes(
        "src/components/ui/alert-dialog.tsx",
        "Alert requires acknowledgement",
      ),
  },
  {
    id: "AC-I03-02",
    name: "Confirm returns boolean",
    fn: () =>
      assertIncludes("src/components/ui/confirm-dialog.tsx", "answer(true)"),
  },
  {
    id: "AC-I03-03",
    name: "Modal renders children",
    fn: () =>
      assertIncludes("src/components/ui/modal-dialog.tsx", "{children}"),
  },
  {
    id: "AC-I03-04",
    name: "Focus trap cycles tab",
    fn: () =>
      assertIncludes(
        "src/components/ui/modal-dialog.tsx",
        'event.key === "Tab"',
      ),
  },
  {
    id: "AC-I03-05",
    name: "Escape closes topmost",
    fn: () =>
      assertIncludes(
        "src/components/ui/modal-dialog.tsx",
        "stack.topId === id",
      ),
  },
  {
    id: "AC-I03-06",
    name: "Overlay click closes",
    fn: () =>
      assertIncludes(
        "src/components/ui/modal-dialog.tsx",
        "onMouseDown={() => onOpenChange(false)}",
      ),
  },
  {
    id: "AC-I03-07",
    name: "Nested stack z-index",
    fn: () => assertIncludes("src/components/ui/dialog-stack.tsx", "topId"),
  },
  {
    id: "AC-I03-08",
    name: "Title announced",
    fn: () =>
      assertIncludes("src/components/ui/modal-dialog.tsx", "aria-labelledby"),
  },
  {
    id: "AC-I03-09",
    name: "Action order correct",
    fn: () =>
      assertIncludes("src/components/ui/confirm-dialog.tsx", "cancelLabel"),
  },
  {
    id: "AC-I03-10",
    name: "Animation present",
    fn: () =>
      assertIncludes("src/components/ui/modal-dialog.tsx", "animate-in"),
  },
]);
