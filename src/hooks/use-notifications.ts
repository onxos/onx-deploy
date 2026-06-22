"use client";

import { useMemo, useState } from "react";

export type NotificationType = "info" | "success" | "warning" | "error";

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
};

const initialNotifications: AppNotification[] = [
  {
    createdAt: "2026-06-22",
    id: "n1",
    message: "Train I component library certified locally.",
    read: false,
    title: "Train I certified",
    type: "success",
  },
  {
    createdAt: "2026-06-22",
    id: "n2",
    message: "Remote staging remains blocked by DNS.",
    read: false,
    title: "Staging DNS blocker",
    type: "warning",
  },
  {
    createdAt: "2026-06-22",
    id: "n3",
    message: "Train J execution package is active.",
    read: true,
    title: "Train J active",
    type: "info",
  },
];

export function useNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [typeFilter, setTypeFilter] = useState<NotificationType | "all">("all");
  const filteredNotifications = useMemo(
    () =>
      typeFilter === "all"
        ? notifications
        : notifications.filter((item) => item.type === typeFilter),
    [notifications, typeFilter],
  );
  const unreadCount = notifications.filter((item) => !item.read).length;

  return {
    filteredNotifications,
    markAllAsRead: () =>
      setNotifications((items) =>
        items.map((item) => ({ ...item, read: true })),
      ),
    notifications,
    setTypeFilter,
    toggleRead: (id: string) =>
      setNotifications((items) =>
        items.map((item) =>
          item.id === id ? { ...item, read: !item.read } : item,
        ),
      ),
    typeFilter,
    unreadCount,
  };
}
