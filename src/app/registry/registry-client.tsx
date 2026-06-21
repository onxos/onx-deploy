"use client";

import TitanTree from "@/components/registry/TitanTree";

export default function RegistryClient() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="mb-2 text-3xl font-bold text-[#1e2d3d]">Titan Registry</h1>
      <p className="mb-6 text-[#5a6c7d]">
        The lineage and genealogy of ONX civilization.
      </p>
      <TitanTree />
    </main>
  );
}
