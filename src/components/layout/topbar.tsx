"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Breadcrumb } from "./breadcrumb";
import { MobileDrawer } from "./mobile-drawer";
import { MobileMenuTrigger } from "./mobile-menu-trigger";
import { UserMenu } from "./user-menu";

export function Topbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 shadow-sm backdrop-blur">
      <div className="flex min-w-0 items-center gap-4">
        <MobileMenuTrigger onClick={() => setDrawerOpen(true)} />
        <Breadcrumb />
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <UserMenu />
      </div>
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
