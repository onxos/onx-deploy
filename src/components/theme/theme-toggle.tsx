"use client";

import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-background text-lg text-foreground transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={toggleTheme}
      title="Toggle theme"
    >
      {isDark ? "☾" : "☼"}
    </button>
  );
}
