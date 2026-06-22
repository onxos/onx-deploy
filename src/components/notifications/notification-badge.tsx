"use client";

export function NotificationBadge({ count }: { count: number }) {
  return (
    <output
      aria-label={`${count} unread notifications`}
      className="inline-flex min-w-6 rounded-full bg-primary px-2 py-1 text-center text-xs font-semibold text-primary-foreground"
    >
      {count}
    </output>
  );
}
