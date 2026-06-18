"use client";
import KnowledgeGraph from "@/components/memory/KnowledgeGraph";
export default function MemoryPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-[#1e2d3d] mb-2">
        Civilization Memory
      </h1>
      <p className="text-[#5a6c7d] mb-6">
        The knowledge graph of ONX — every document, decision, and correction
        preserved.
      </p>
      <KnowledgeGraph />
    </main>
  );
}
