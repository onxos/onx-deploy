"use client";

import { StatusBadge } from "@/components/ui/status-badge";
import type { AppNotification } from "@/hooks/use-notifications";

export function NotificationItem({
  notification,
  onToggleRead,
}: {
  notification: AppNotification;
  onToggleRead: (id: string) => void;
}) {
  return (
    <article className="rounded-lg border bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{notification.title}</h3>
            <StatusBadge variant={notification.type}>
              {notification.type}
            </StatusBadge>
            {!notification.read ? (
              <span className="text-xs font-medium text-primary">Unread</span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {notification.message}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {notification.createdAt}
          </p>
        </div>
        <button
          className="rounded-md border px-3 py-2 text-sm"
          onClick={() => onToggleRead(notification.id)}
          type="button"
        >
          Mark {notification.read ? "unread" : "read"}
        </button>
      </div>
    </article>
  );
}
