"use client";

export function InstitutionStats({
  stats,
}: {
  stats: { activeNow: number; roles: number; totalMembers: number };
}) {
  return (
    <section className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-lg border bg-card p-4">
        <p className="text-sm text-muted-foreground">Members</p>
        <p className="text-2xl font-semibold">{stats.totalMembers}</p>
      </div>
      <div className="rounded-lg border bg-card p-4">
        <p className="text-sm text-muted-foreground">Active now</p>
        <p className="text-2xl font-semibold">{stats.activeNow}</p>
      </div>
      <div className="rounded-lg border bg-card p-4">
        <p className="text-sm text-muted-foreground">Roles</p>
        <p className="text-2xl font-semibold">{stats.roles}</p>
      </div>
    </section>
  );
}
