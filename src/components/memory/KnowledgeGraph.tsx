"use client";
import { useState } from "react";
import {
  knowledgeCategories,
  knowledgeItems,
} from "@/lib/memory/knowledge-data";
export default function KnowledgeGraph() {
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const filtered = activeCat
    ? knowledgeItems.filter((i) => i.category === activeCat)
    : [];
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {knowledgeCategories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setActiveCat(activeCat === cat.key ? null : cat.key)}
            className={`p-4 rounded-lg border text-left transition-colors ${activeCat === cat.key ? "bg-[#1e2d3d] text-white border-[#1e2d3d]" : "bg-white hover:bg-gray-50 border-gray-200"}`}
          >
            <p className="text-2xl font-bold text-[#c9a84c]">{cat.count}</p>
            <p
              className={`text-sm mt-1 ${activeCat === cat.key ? "text-gray-300" : "text-[#5a6c7d]"}`}
            >
              {cat.label}
            </p>
          </button>
        ))}
      </div>
      {activeCat && filtered.length > 0 && (
        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-semibold text-[#1e2d3d] mb-3">
            {knowledgeCategories.find((c) => c.key === activeCat)?.label}
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-2 hover:bg-gray-50 rounded text-sm"
              >
                <p className="font-medium text-[#2c3e50]">{item.title}</p>
                <p className="text-xs text-[#5a6c7d]">
                  {item.documentId} | {item.date}
                </p>
                {item.relatedItems.length > 0 && (
                  <p className="text-xs text-[#c9a84c] mt-0.5">
                    Related: {item.relatedItems.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
