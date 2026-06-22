"use client";

import { useBreakpoint } from "@/hooks/use-breakpoint";
import { Sidebar } from "./sidebar";

export function CollapsibleSidebar() {
  const breakpoint = useBreakpoint();
  const isCollapsed = breakpoint === "md";

  return <Sidebar isCollapsed={isCollapsed} />;
}
