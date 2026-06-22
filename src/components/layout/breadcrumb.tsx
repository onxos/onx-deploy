"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routeLabels } from "@/config/routes";

function labelFor(path: string, segment: string) {
  return (
    routeLabels.get(path) ??
    segment
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return <span className="text-sm text-muted-foreground">Home</span>;
  }

  return (
    <nav aria-label="Breadcrumb" className="hidden items-center gap-2 md:flex">
      <Link
        href="/dashboard"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ONX
      </Link>
      {segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join("/")}`;
        const isCurrent = index === segments.length - 1;
        return (
          <span key={path} className="flex items-center gap-2">
            <span className="text-muted-foreground">/</span>
            {isCurrent ? (
              <span className="text-sm font-medium text-foreground">
                {labelFor(path, segment)}
              </span>
            ) : (
              <Link
                href={path}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {labelFor(path, segment)}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
