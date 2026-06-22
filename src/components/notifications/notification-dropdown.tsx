"use client";

import { useEffect, useRef, useState } from "react";
import { useNotifications } from "@/hooks/use-notifications";
import { NotificationBadge } from "./notification-badge";
import { NotificationItem } from "./notification-item";

export function NotificationDropdown() {
  const { filteredNotifications, toggleRead, unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node))
        setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        Notifications <NotificationBadge count={unreadCount} />
      </button>
      {open ? (
        <div className="absolute right-0 z-40 mt-2 max-h-96 w-[min(28rem,calc(100vw-2rem))] overflow-auto rounded-lg border bg-popover p-3 shadow-lg">
          <div className="space-y-3">
            {filteredNotifications.slice(0, 3).map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onToggleRead={toggleRead}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
