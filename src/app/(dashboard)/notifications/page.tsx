"use client";

import { NotificationBadge } from "@/components/notifications/notification-badge";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import { NotificationFilters } from "@/components/notifications/notification-filters";
import { NotificationItem } from "@/components/notifications/notification-item";
import { NotificationList } from "@/components/notifications/notification-list";
import { useNotifications } from "@/hooks/use-notifications";

export default function NotificationsPage() {
  const {
    filteredNotifications,
    markAllAsRead,
    setTypeFilter,
    toggleRead,
    typeFilter,
    unreadCount,
  } = useNotifications();
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Notification Center</h1>
          <p className="text-muted-foreground">
            Review communication, read states, and filtering.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBadge count={unreadCount} />
          <NotificationDropdown />
        </div>
      </div>
      <NotificationFilters active={typeFilter} onChange={setTypeFilter} />
      <button
        className="rounded-md border px-3 py-2 text-sm"
        onClick={markAllAsRead}
        type="button"
      >
        Mark all as read
      </button>
      {filteredNotifications.length ? (
        <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onToggleRead={toggleRead}
              />
            ))}
          </div>
          <NotificationList notifications={filteredNotifications} />
        </div>
      ) : (
        <p className="rounded-lg border p-6 text-muted-foreground">
          No notifications.
        </p>
      )}
    </main>
  );
}
