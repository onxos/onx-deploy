"use client";

import type { NotificationType } from "@/hooks/use-notifications";

const filters: Array<NotificationType | "all"> = [
  "all",
  "info",
  "success",
  "warning",
  "error",
];

export function NotificationFilters({
  active,
  onChange,
}: {
  active: NotificationType | "all";
  onChange: (type: NotificationType | "all") => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          className="rounded-full border px-3 py-1 text-sm data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
          data-active={active === filter}
          key={filter}
          onClick={() => onChange(filter)}
          type="button"
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
