"use client";

export function ToastProgress({ duration = 5000 }: { duration?: number }) {
  return (
    <div
      aria-hidden="true"
      className="absolute bottom-0 left-0 h-1 w-full origin-left bg-current opacity-30"
      style={{ animation: `toast-progress ${duration}ms linear forwards` }}
    />
  );
}
