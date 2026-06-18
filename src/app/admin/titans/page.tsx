"use client";

import { api } from "@/trpc/react";

export default function AdminTitansPage() {
  const { data: titans } = api.titan.listTitans.useQuery();

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1e2d3d]">Titan Registry</h2>
        <p className="mt-1 text-sm text-[#5a6c7d]">
          Read-only Wave 4 registry view. Titan editing is deferred.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {(titans ?? []).map((titan) => (
          <article key={titan.id} className="rounded border bg-white p-5">
            <p className="text-xs font-semibold uppercase text-[#c9a84c]">
              Titan {titan.number}
            </p>
            <h3 className="mt-1 text-lg font-bold text-[#1e2d3d]">
              {titan.name}
            </h3>
            <p className="text-sm font-medium text-[#5a6c7d]">
              {titan.domain} · {titan.systemName}
            </p>
            <p className="mt-3 text-sm text-[#2c3e50]">{titan.description}</p>
            {titan.manifesto && (
              <p className="mt-3 border-l-2 border-[#c9a84c] pl-3 text-sm italic text-[#5a6c7d]">
                {titan.manifesto}
              </p>
            )}
            <p className="mt-3 text-xs font-semibold text-[#1e2d3d]">
              SECH: {titan.sechPrimary}
              {titan.sechSecondary ? ` / ${titan.sechSecondary}` : ""}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
