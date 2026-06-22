"use client";

import { useTheme } from "@/components/theme/theme-provider";

export function ThemeSection() {
  const { setTheme, theme } = useTheme();
  return (
    <section className="rounded-lg border bg-card p-5">
      <h2 className="font-semibold">Theme preference</h2>
      <p className="text-sm text-muted-foreground">Current theme: {theme}</p>
      <div className="mt-4 flex gap-2">
        {(["system", "light", "dark"] as const).map((option) => (
          <button
            className="rounded-md border px-3 py-2 text-sm data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
            data-active={theme === option}
            key={option}
            onClick={() => setTheme(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}
