"use client";

import { titans as staticTitans } from "@/lib/registry/titans";
import { api } from "@/trpc/react";

export default function TitanTree() {
  const { data: dbTitans } = api.titan.listTitans.useQuery();
  const titans = dbTitans ?? staticTitans;

  return (
    <div className="relative pl-8 border-l-2 border-[#1e2d3d] space-y-8">
      {titans.map((t) => (
        <div key={t.id} className="relative">
          <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-[#c9a84c] border-4 border-[#faf9f5]" />
          <h2 className="text-lg font-bold text-[#1e2d3d]">{t.name}</h2>
          <p className="text-sm text-[#5a6c7d] font-medium">
            {"title" in t ? String(t.title) : t.domain}
          </p>
          <p className="text-sm text-[#2c3e50] mt-1">{t.description}</p>
          {"manifesto" in t && t.manifesto && (
            <p className="text-sm text-[#7a5a0a] italic mt-1 border-l-2 border-[#c9a84c] pl-3">
              {String(t.manifesto)}
            </p>
          )}
          <div className="mt-2 text-xs text-[#5a6c7d] space-y-0.5">
            {"associatedSbps" in t ? (
              <>
                <p>SBPs: {(t.associatedSbps as string[]).join(", ")}</p>
                <p>Docs: {(t.associatedDocs as string[]).join(", ")}</p>
              </>
            ) : (
              <>
                <p>System: {t.systemName}</p>
                <p>
                  SECH: {t.sechPrimary}
                  {t.sechSecondary ? ` / ${t.sechSecondary}` : ""}
                </p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
