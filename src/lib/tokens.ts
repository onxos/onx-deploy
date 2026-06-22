export const tokens = {
  colors: {
    background: "hsl(var(--background))",
    foreground: "hsl(var(--foreground))",
    card: "hsl(var(--card))",
    primary: "hsl(var(--primary))",
    muted: "hsl(var(--muted))",
    border: "hsl(var(--border))",
    sidebar: "hsl(var(--sidebar-background))",
  },
  spacing: {
    shell: "1.5rem",
    sidebarWidth: "16rem",
    sidebarCollapsedWidth: "4rem",
    topbarHeight: "4rem",
  },
  radii: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
  },
  shadows: {
    sm: "0 1px 2px rgb(15 23 42 / 0.08)",
    md: "0 8px 24px rgb(15 23 42 / 0.12)",
  },
} as const;

export type DesignTokens = typeof tokens;
