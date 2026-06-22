"use client";

export function FormError({ children }: { children?: React.ReactNode }) {
  if (!children) {
    return null;
  }

  return (
    <p aria-live="polite" className="text-sm font-medium text-destructive">
      {children}
    </p>
  );
}
