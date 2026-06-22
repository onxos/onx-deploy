"use client";

import { usePathname } from "next/navigation";

export function useActiveRoute() {
  const pathname = usePathname();

  return {
    pathname,
    isActive: (path: string) =>
      pathname === path || (path !== "/" && pathname.startsWith(`${path}/`)),
  };
}
