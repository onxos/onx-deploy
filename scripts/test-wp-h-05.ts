import { fileExists, includes, runWpTest } from "./train-h-test-utils";

runWpTest("WP-H-05", [
  {
    id: "01",
    description: "Global CSS defines custom color properties",
    pass: includes("src/app/globals.css", "--background:"),
  },
  {
    id: "02",
    description: "Theme toggle switches light and dark",
    pass: includes("src/components/theme/theme-toggle.tsx", "toggleTheme"),
  },
  {
    id: "03",
    description: "Theme preference persists in localStorage",
    pass: includes("src/components/theme/theme-provider.tsx", "localStorage"),
  },
  {
    id: "04",
    description: "System preference is detected",
    pass: includes(
      "src/components/theme/theme-provider.tsx",
      "prefers-color-scheme",
    ),
  },
  {
    id: "05",
    description: "Shell colors use token classes",
    pass: includes("src/components/layout/app-shell.tsx", "bg-background"),
  },
  {
    id: "06",
    description: "Foreground and muted colors use contrast tokens",
    pass: includes("src/app/globals.css", "--muted-foreground:"),
  },
  {
    id: "07",
    description: "Wrong-theme flash prevention is wired",
    pass: includes("src/app/layout.tsx", "suppressHydrationWarning"),
  },
  {
    id: "08",
    description: "Design tokens are available from TypeScript",
    pass: fileExists("src/lib/tokens.ts"),
  },
  {
    id: "09",
    description: "Tailwind config maps token colors",
    pass: includes("tailwind.config.ts", "hsl(var(--primary))"),
  },
  {
    id: "10",
    description: "Theme transitions are configured",
    pass: includes("src/app/globals.css", "transition-property"),
  },
]);
