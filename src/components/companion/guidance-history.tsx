"use client";

export function GuidanceHistory({ items }: { items: string[] }) {
  return (
    <section className="rounded-lg border bg-card p-4">
      <h2 className="font-semibold">Guidance history</h2>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li className="rounded-md border p-2" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
