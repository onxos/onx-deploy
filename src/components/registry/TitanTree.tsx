"use client";
import { titans } from "@/lib/registry/titans";
export default function TitanTree() {
  return (
    <div className="relative pl-8 border-l-2 border-[#1e2d3d] space-y-8">
      {titans.map((t) => (
        <div key={t.id} className="relative">
          <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-[#c9a84c] border-4 border-[#faf9f5]" />
          <h3 className="text-lg font-bold text-[#1e2d3d]">{t.name}</h3>
          <p className="text-sm text-[#5a6c7d] font-medium">{t.title}</p>
          <p className="text-sm text-[#2c3e50] mt-1">{t.description}</p>
          <div className="mt-2 text-xs text-[#5a6c7d] space-y-0.5">
            <p>SBPs: {t.associatedSbps.join(", ")}</p>
            <p>Docs: {t.associatedDocs.join(", ")}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
