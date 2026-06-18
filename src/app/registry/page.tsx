"use client";
import TitanTree from "@/components/registry/TitanTree";
export default function RegistryPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-[#1e2d3d] mb-2">Titan Registry</h1>
      <p className="text-[#5a6c7d] mb-6">
        The lineage and genealogy of ONX civilization.
      </p>
      <TitanTree />
    </main>
  );
}
