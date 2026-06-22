"use client";

export function CompanionAvatar({ status = "online" }: { status?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-14 w-14 place-items-center rounded-full border bg-primary/10 font-semibold text-primary">
        ON
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
      </div>
      <div>
        <p className="font-semibold">ONX Companion</p>
        <p className="text-sm text-muted-foreground">{status}</p>
      </div>
    </div>
  );
}
