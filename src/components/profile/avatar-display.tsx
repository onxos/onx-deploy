"use client";

import { cn } from "@/lib/utils";

function initialsFor(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AvatarDisplay({
  name,
  size = "md",
}: {
  name: string;
  size?: "md" | "lg";
}) {
  return (
    <div className="space-y-2">
      <div
        aria-label={`${name} avatar`}
        className={cn(
          "grid rounded-full border bg-primary/10 font-semibold text-primary",
          size === "lg"
            ? "h-24 w-24 place-items-center text-2xl"
            : "h-10 w-10 place-items-center text-sm",
        )}
        role="img"
      >
        {initialsFor(name)}
      </div>
      {size === "lg" ? (
        <p className="text-center text-xs text-muted-foreground">
          Avatar upload ready
        </p>
      ) : null}
    </div>
  );
}
