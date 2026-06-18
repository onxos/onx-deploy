"use client";
import DocumentTree from "@/components/knowledge/DocumentTree";
import SearchBar from "@/components/knowledge/SearchBar";
export default function KnowledgePage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-[#1e2d3d] mb-2">
        ONX Knowledge Center
      </h1>
      <p className="text-[#5a6c7d] mb-6">
        Browse all approved ONX architecture, decisions, and preservation
        records.
      </p>
      <SearchBar />
      <div className="mt-6">
        <DocumentTree />
      </div>
    </main>
  );
}
