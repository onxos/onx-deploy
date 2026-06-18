"use client";
import {
  deferredCapabilities,
  operationalCapabilities,
} from "@/lib/va-capabilities/capabilities";
export default function CapabilityList() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-[#1e2d3d] mb-1 flex items-center gap-2">
          <span className="text-green-500">✓</span> Operational (
          {operationalCapabilities.length})
        </h2>
        <div className="space-y-3">
          {operationalCapabilities.map((c) => (
            <div
              key={c.id}
              className="border rounded-lg p-4 bg-white hover:shadow-sm transition-shadow"
            >
              <h3 className="font-semibold text-[#1e2d3d]">{c.name}</h3>
              <p className="text-sm text-[#2c3e50] mt-1">{c.description}</p>
              <p className="text-sm text-[#5a6c7d] italic mt-2 border-l-2 border-[#c9a84c] pl-3">
                &ldquo;{c.exampleQuery}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-[#1e2d3d] mb-1 flex items-center gap-2">
          <span className="text-yellow-500">○</span> Deferred (
          {deferredCapabilities.length})
        </h2>
        <div className="space-y-3">
          {deferredCapabilities.map((c) => (
            <div
              key={c.id}
              className="border rounded-lg p-4 bg-yellow-50 border-yellow-200"
            >
              <h3 className="font-semibold text-[#1e2d3d]">{c.name}</h3>
              <p className="text-sm text-[#2c3e50] mt-1">{c.description}</p>
              <p className="text-sm text-[#5a6c7d] italic mt-2 border-l-2 border-[#c9a84c] pl-3">
                &ldquo;{c.exampleQuery}&rdquo;
              </p>
              <p className="text-xs text-yellow-700 mt-2">
                Deferred: {c.reasonDeferred}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
