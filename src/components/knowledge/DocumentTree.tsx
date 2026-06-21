"use client";
import { useState } from "react";
import {
  knowledgeCategories,
  knowledgeItems,
} from "@/lib/memory/knowledge-data";
import { api } from "@/trpc/react";

export default function DocumentTree() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { data: dbArticles } = api.civilization.listArticles.useQuery({
    limit: 100,
  });

  const categories =
    dbArticles && dbArticles.length > 0
      ? Array.from(new Set(dbArticles.map((article) => article.category))).map(
          (category) => ({
            key: category,
            label: category
              .split("-")
              .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
              .join(" "),
            count: dbArticles.filter((article) => article.category === category)
              .length,
          }),
        )
      : knowledgeCategories;

  const items =
    dbArticles && dbArticles.length > 0
      ? dbArticles.map((article) => ({
          id: article.id.toString(),
          title: article.title,
          category: article.category,
        }))
      : knowledgeItems;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map((cat) => (
        <div key={cat.key} className="border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setExpanded(expanded === cat.key ? null : cat.key)}
            className="w-full px-4 py-3 bg-[#1e2d3d] text-[#c9a84c] font-semibold text-left flex justify-between items-center hover:bg-[#2a3f54] transition-colors"
          >
            <span>{cat.label}</span>
            <span className="text-white text-sm">
              {cat.count} items {expanded === cat.key ? "▾" : "▸"}
            </span>
          </button>
          {expanded === cat.key && (
            <div className="bg-white p-3 max-h-64 overflow-y-auto">
              {items.map((item) =>
                item.category === cat.key ? (
                  <div
                    key={item.id}
                    className="py-1 px-2 hover:bg-gray-100 rounded cursor-pointer text-sm text-[#2c3e50]"
                  >
                    {item.title}
                  </div>
                ) : null,
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
