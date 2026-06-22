import { assertIncludes, runWpTests } from "./train-i-test-utils";

await runWpTests([
  {
    id: "AC-I05-01",
    name: "Search debounce",
    fn: () =>
      assertIncludes("src/components/ui/search-input.tsx", "setTimeout"),
  },
  {
    id: "AC-I05-02",
    name: "Filter chips add/remove",
    fn: () => assertIncludes("src/components/ui/filter-chips.tsx", "onRemove"),
  },
  {
    id: "AC-I05-03",
    name: "Status colors",
    fn: () => assertIncludes("src/components/ui/status-badge.tsx", "variants"),
  },
  {
    id: "AC-I05-04",
    name: "Tag dismiss",
    fn: () => assertIncludes("src/components/ui/tag.tsx", "onRemove"),
  },
  {
    id: "AC-I05-05",
    name: "Autocomplete keyboard",
    fn: () => assertIncludes("src/components/ui/autocomplete.tsx", "ArrowDown"),
  },
  {
    id: "AC-I05-06",
    name: "Command palette shortcut",
    fn: () =>
      assertIncludes("src/components/ui/command-palette.tsx", "metaKey"),
  },
  {
    id: "AC-I05-07",
    name: "Avatar overflow",
    fn: () => assertIncludes("src/components/ui/avatar-group.tsx", "overflow"),
  },
  {
    id: "AC-I05-08",
    name: "Copy feedback",
    fn: () => assertIncludes("src/components/ui/copy-button.tsx", "writeText"),
  },
  {
    id: "AC-I05-09",
    name: "Keyboard accessibility",
    fn: () => assertIncludes("src/components/ui/command-palette.tsx", "Escape"),
  },
  {
    id: "AC-I05-10",
    name: "Dark mode",
    fn: () => assertIncludes("src/components/ui/status-badge.tsx", "dark:"),
  },
]);
