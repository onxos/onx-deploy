"use client";

export function MobileMenuTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-background text-2xl text-foreground transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
      aria-label="Open navigation"
      onClick={onClick}
    >
      ≡
    </button>
  );
}
