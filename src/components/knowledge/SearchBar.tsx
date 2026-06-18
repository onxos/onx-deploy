"use client";
import { useState } from "react";
import { knowledgeItems } from "@/lib/memory/knowledge-data";
export default function SearchBar() {
  const [query, setQuery] = useState("");
  const results = query.trim()
    ? knowledgeItems.filter((i) =>
        i.title.toLowerCase().includes(query.toLowerCase()),
      )
    : [];
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search ONX knowledge..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#c9a84c] focus:outline-none text-[#2c3e50]"
      />
      {query.trim() && results.length > 0 && (
        <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg max-h-48 overflow-y-auto">
          {results.map((r) => (
            <div
              key={r.id}
              className="px-4 py-2 hover:bg-gray-100 text-sm text-[#2c3e50] cursor-pointer"
            >
              {r.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
