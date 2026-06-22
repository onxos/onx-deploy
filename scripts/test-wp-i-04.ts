import { assertIncludes, runWpTests } from "./train-i-test-utils";

await runWpTests([
  {
    id: "AC-I04-01",
    name: "Variant colors",
    fn: () =>
      assertIncludes("src/components/ui/toast-item.tsx", "variantClass"),
  },
  {
    id: "AC-I04-02",
    name: "Auto dismiss",
    fn: () => assertIncludes("src/components/ui/toast-item.tsx", "setTimeout"),
  },
  {
    id: "AC-I04-03",
    name: "Progress bar",
    fn: () =>
      assertIncludes("src/components/ui/toast-progress.tsx", "toast-progress"),
  },
  {
    id: "AC-I04-04",
    name: "Stack vertically",
    fn: () =>
      assertIncludes("src/components/ui/toast-viewport.tsx", "flex-col"),
  },
  {
    id: "AC-I04-05",
    name: "Action callback",
    fn: () => assertIncludes("src/components/ui/toast-action.tsx", "onClick"),
  },
  {
    id: "AC-I04-06",
    name: "Persistent toast",
    fn: () => assertIncludes("src/components/ui/toast-item.tsx", "persistent"),
  },
  {
    id: "AC-I04-07",
    name: "Limit max 5",
    fn: () => assertIncludes("src/hooks/use-toast.ts", "slice(0, 5)"),
  },
  {
    id: "AC-I04-08",
    name: "Screen reader announces",
    fn: () => assertIncludes("src/components/ui/toast-item.tsx", "aria-live"),
  },
  {
    id: "AC-I04-09",
    name: "Removed from DOM",
    fn: () => assertIncludes("src/hooks/use-toast.ts", "filter"),
  },
  {
    id: "AC-I04-10",
    name: "Theme-aware",
    fn: () => assertIncludes("src/components/ui/toast-item.tsx", "bg-card"),
  },
]);
