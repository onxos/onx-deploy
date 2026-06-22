"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { NavMenu } from "./nav-menu";
import { UserMenuMini } from "./user-menu-mini";

export function MobileDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 md:hidden",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        aria-label="Close navigation overlay"
        className={cn(
          "absolute inset-0 bg-foreground/30 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "absolute left-0 top-0 flex h-screen w-80 max-w-[85vw] flex-col border-r border-border bg-sidebar text-sidebar-foreground shadow-md transition-transform duration-200",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <span className="text-lg font-semibold text-foreground">ONX</span>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={onClose}
            aria-label="Close navigation"
          >
            ×
          </button>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
          <NavMenu onNavigate={onClose} />
        </nav>
        <div className="mt-auto border-t border-sidebar-border p-3">
          <UserMenuMini />
        </div>
      </aside>
    </div>
  );
}
