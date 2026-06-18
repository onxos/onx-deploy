"use client";
import { useState } from "react";
import { gaps } from "@/lib/gaps/gap-data";

type Filter = "all" | "closed" | "roadmap";
export default function GapCards() {
  const [filter, setFilter] = useState<Filter>("all");
  const filtered =
    filter === "all" ? gaps : gaps.filter((g) => g.status === filter);
  return (
    <div>
      <div className="flex gap-2 mb-4">
        {(["all", "closed", "roadmap"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? "bg-[#1e2d3d] text-white" : "bg-gray-100 text-[#5a6c7d] hover:bg-gray-200"}`}
          >
            {f} (
            {f === "all"
              ? gaps.length
              : gaps.filter((g) => g.status === f).length}
            )
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((gap) => (
          <div
            key={gap.id}
            className={`border rounded-lg p-4 ${gap.status === "closed" ? "border-green-300 bg-green-50" : "border-yellow-300 bg-yellow-50"}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`w-2 h-2 rounded-full ${gap.status === "closed" ? "bg-green-500" : "bg-yellow-500"}`}
              />
              <span
                className={`text-xs font-bold uppercase ${gap.status === "closed" ? "text-green-700" : "text-yellow-700"}`}
              >
                {gap.status}
              </span>
            </div>
            <h3 className="font-semibold text-[#1e2d3d] text-sm">{gap.name}</h3>
            <p className="text-xs text-[#5a6c7d] mt-1">{gap.code}</p>
            {gap.closureDocument && (
              <p className="text-xs text-green-600 mt-2">
                Closed: {gap.closureDocument}
              </p>
            )}
            {gap.triggerCondition && (
              <p className="text-xs text-yellow-700 mt-2">
                Trigger: {gap.triggerCondition} ({gap.targetDate})
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
