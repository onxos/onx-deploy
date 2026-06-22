"use client";

export function RoleDistribution({
  counts,
}: {
  counts: Record<string, number>;
}) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {Object.entries(counts).map(([role, count]) => (
        <div className="rounded-lg border bg-card p-4" key={role}>
          <p className="text-sm capitalize text-muted-foreground">{role}</p>
          <p className="text-2xl font-semibold">{count}</p>
        </div>
      ))}
    </section>
  );
}
