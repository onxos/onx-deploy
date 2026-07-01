"use client";

import SentinelBadge from "@/components/sech/SentinelBadge";
import { CollapsibleSidebar } from "./collapsible-sidebar";
import { ContentArea } from "./content-area";
import { ErrorBoundary } from "./error-boundary";
import { Topbar } from "./topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <CollapsibleSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar />
        <ContentArea>
          <ErrorBoundary>{children}</ErrorBoundary>
        </ContentArea>
        <SentinelBadge />
      </div>
    </div>
  );
}
